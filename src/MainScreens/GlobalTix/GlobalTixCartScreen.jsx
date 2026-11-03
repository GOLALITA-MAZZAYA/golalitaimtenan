import React, { useState, useCallback, useEffect, useMemo, memo } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Text, Modal } from 'react-native';
import Image from "../../components/AppImage";
import { useSelector, useDispatch } from 'react-redux';
import { TypographyText } from '../../components/Typography';
import { BALOO_SEMIBOLD, BALOO_REGULAR } from '../../redux/types';
import CommonButton from '../../components/CommonButton/CommonButton';
import { colors } from '../../components/colors';
import { useTheme } from '../../components/ThemeProvider';
import { useTranslation } from 'react-i18next';
import MainLayout from '../../components/MainLayout';
import Header from '../../components/Header';
import { SCREEN_HEIGHT } from '../../styles/mainStyles';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getToken } from '../../utils/secureStorage';
import {
  globalTixCartItemsSelector,
  globalTixCartTotalPriceSelector,
  globalTixCartTotalQuantitySelector
} from '../../redux/globalTix/globalTix-cart-selectors';
import { userSelector } from '../../redux/auth/auth-selectors';
import {
  removeFromGlobalTixCartThunk,
  updateGlobalTixCartQuantityThunk,
  clearGlobalTixCartThunk
} from '../../redux/globalTix/globalTix-cart-thunks';
import { globalTixAPI } from '../../redux/globalTix/globalTix-api';
import { setGlobalTixPaymentData } from '../../redux/globalTix/globalTix-actions';
import { getCurrentConfig } from '../../config/globalTix';
import { getCommission } from '../LoyaltyPoints/LoyaltyGiftCardInfo/helpers';
import { checkGlobalTixPaymentStatus } from '../../api/giftCard';
import { useFocusEffect } from '@react-navigation/native';
import { showMessage } from 'react-native-flash-message';
import { convertToQAR } from '../../utils/currencyConverter';
import store from '../../redux/store';
import { translateText } from '../../utils/translationService';
import { getTicketSellingPrice } from '../../utils/globalTixPricing';
import { GLOBALTIX_CONFIG } from '../../config/globalTix';
import { org } from '../../org/config';

// Pure helpers — no component state, hoisted so they aren't recreated every render.
const formatCurrency = (amount) => {
  return Number(amount).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

const generateImageUrl = (imagePath) => {
  return `https://product-image.globaltix.com/stg-gtImage/${imagePath}`;
};

const GlobalTixCartScreen = ({ navigation }) => {
  const { isDark } = useTheme();
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();

  const cartItems = useSelector(globalTixCartItemsSelector);
  const totalPrice = useSelector(globalTixCartTotalPriceSelector);
  const totalQuantity = useSelector(globalTixCartTotalQuantitySelector);
  const user = useSelector(userSelector);

  // Helper function to ensure proper decimal formatting for monetary values
  const formatMonetaryValue = (amount) => {
    return parseFloat(Number(amount || 0).toFixed(2));
  };

  // Calculate bank charge and final amount in integer cents so the
  // displayed total always equals subtotal + bank charge exactly.
  const bankCharge = getCommission(totalPrice || 0);
  const finalAmount =
    (Math.round((totalPrice || 0) * 100) + Math.round(bankCharge * 100)) / 100;

  const cartItemsArray = useMemo(() => Object.values(cartItems), [cartItems]);



  // Customer information state
  const [customerInfo, setCustomerInfo] = useState({
    lastName: '',
    firstName: '',
    email: '',
    alternateEmail: '',
    nricPassport: '',
    mobileCode: '+974',
    mobileNumber: '',
    partnerReference: '',
    remarks: ''
  });

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('CREDIT');
  const [selectedItems, setSelectedItems] = useState({});
  const [loading, setLoading] = useState(false);
  const [paymentData, setPaymentData] = useState(null);

  // Question handling state
  const [ticketQuestions, setTicketQuestions] = useState({});
  const [questionAnswers, setQuestionAnswers] = useState({});
  const [loadingQuestions, setLoadingQuestions] = useState(false);

  // Modal state
  const [isQuestionsModalVisible, setIsQuestionsModalVisible] = useState(false);
  const [currentTicketTypeId, setCurrentTicketTypeId] = useState(null);
  const [currentTicketTypeName, setCurrentTicketTypeName] = useState('');
  const [tempAnswers, setTempAnswers] = useState({});

  // Translated ticket and option names cache
  const [translatedTicketNames, setTranslatedTicketNames] = useState({});
  const [translatedOptionNames, setTranslatedOptionNames] = useState({});


  // Parse phone number to extract country code and number
  const parsePhoneNumber = (phone) => {
    if (!phone) return { code: '+974', number: '' };

    // Remove any spaces or special characters
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');

    // Check if it starts with +974 (Qatar country code)
    if (cleanPhone.startsWith('+974')) {
      return {
        code: '+974',
        number: cleanPhone.substring(4)
      };
    }

    // Check if it starts with 974
    if (cleanPhone.startsWith('974')) {
      return {
        code: '+974',
        number: cleanPhone.substring(3)
      };
    }

    // If it doesn't start with country code, assume it's a local number
    return {
      code: '+974',
      number: cleanPhone
    };
  };

  const handleRemoveItem = useCallback((productId, optionId, ticketTypeId) => {
    dispatch(removeFromGlobalTixCartThunk({
      productId,
      optionId,
      ticketTypeId,
    }));
  }, [dispatch]);

  const handleUpdateQuantity = useCallback((productId, optionId, ticketTypeId, quantity) => {
    if (quantity <= 0) {
      handleRemoveItem(productId, optionId, ticketTypeId);
    } else {
      dispatch(updateGlobalTixCartQuantityThunk({
        productId,
        optionId,
        ticketTypeId,
        quantity,
      }));
    }
  }, [dispatch, handleRemoveItem]);

  const handleClearCart = () => {
    dispatch(clearGlobalTixCartThunk());
  };

  // Extract questions from product options data
  const extractQuestionsFromOptions = () => {
    const questionsMap = {};

    for (const item of cartItemsArray) {
      const optionId = item.optionId;
      const ticketTypeId = item.ticketTypeId;

      console.log(`Extracting questions for ticket type ${ticketTypeId} from option ${optionId}`);
      console.log('Item data:', {
        hasOption: !!item.option,
        optionQuestions: item.option?.questions,
        optionQuestionsLength: item.option?.questions?.length
      });

      // Get questions from the option data - handle different possible structures
      let questions = [];

      if (item.option) {
        // Check for questions in different possible locations
        if (item.option.questions && Array.isArray(item.option.questions)) {
          questions = item.option.questions;
        } else if (item.option.questionList && Array.isArray(item.option.questionList)) {
          questions = item.option.questionList;
        } else if (item.option.qna && Array.isArray(item.option.qna)) {
          questions = item.option.qna;
        }

        // Validate and clean questions data
        questions = questions.filter(q => {
          const isValid = q && (q.id || q.questionId) && (q.question || q.text || q.label);
          if (!isValid) {
            console.warn('Invalid question found:', q);
          }
          return isValid;
        });

        // Normalize question structure
        questions = questions.map(q => ({
          id: q.id || q.questionId,
          question: q.question || q.text || q.label || 'Question',
          type: q.type || q.questionType || 'FREETEXT',
          questionCode: q.questionCode || q.code,
          optionCode: q.optionCode,
          options: q.options || q.optionList || [],
          optionList: q.optionList || q.options || [],
          isRequired: q.isRequired !== false // Assume required unless explicitly false
        }));
      }

      questionsMap[ticketTypeId] = questions;
      console.log(`Found ${questions.length} questions for ticket type ${ticketTypeId}:`, questions);

      // Debug each question structure
      questions.forEach((q, qIdx) => {
        console.log(`Question ${qIdx + 1} for ticket ${ticketTypeId}:`, {
          id: q.id,
          question: q.question,
          type: q.type,
          questionCode: q.questionCode,
          hasOptions: !!(q.options && q.options.length > 0)
        });
      });
    }

    setTicketQuestions(prev => ({ ...prev, ...questionsMap }));
  };

  // Handle question answer changes
  const handleQuestionAnswer = (ticketTypeId, questionId, answer) => {
    setQuestionAnswers(prev => ({
      ...prev,
      [`${ticketTypeId}_${questionId}`]: answer
    }));
  };

  // Get questions for a specific ticket type
  const getQuestionsForTicketType = useCallback((ticketTypeId) => {
    return ticketQuestions[ticketTypeId] || [];
  }, [ticketQuestions]);

  // Get answer for a specific question
  const getQuestionAnswer = useCallback((ticketTypeId, questionId) => {
    return questionAnswers[`${ticketTypeId}_${questionId}`] || '';
  }, [questionAnswers]);

  // Dynamic question input renderer
  const renderQuestionInput = (question, index) => {
    const questionType = question.type?.toUpperCase() || 'FREETEXT';
    const currentAnswer = tempAnswers[question.id] || '';

    console.log(`Rendering question ${index + 1}: Type=${questionType}, ID=${question.id}, Question="${question.question}"`);

    // Handle OPTION type questions (multiple choice)
    if (questionType === 'OPTION' && (question.optionList || question.options)) {
      const options = question.optionList || question.options || [];
      return (
        <View style={styles.optionContainer}>
          {options.map((option, optIndex) => {
            const optionKey = option.key || option.value || option;
            const optionValue = option.value || option.key || option;
            const isSelected = currentAnswer === optionKey;

            return (
              <TouchableOpacity
                key={optIndex}
                style={[
                  styles.optionButton,
                  {
                    backgroundColor: isSelected
                      ? (colors.blue || '#2196F3')
                      : (isDark ? colors.darkGrey : colors.lightGrey),
                    borderColor: isDark ? colors.grey : colors.lightGrey
                  }
                ]}
                onPress={() => handleTempAnswerChange(question.id, optionKey)}
              >
                <TypographyText
                  title={optionValue}
                  size={14}
                  textColor={isSelected ? colors.white : (isDark ? colors.white : colors.black)}
                />
              </TouchableOpacity>
            );
          })}
        </View>
      );
    }

    // Handle DATE type questions
    if (questionType === 'DATE') {
      return (
        <TextInput
          style={[
            styles.modalQuestionInput,
            {
              backgroundColor: isDark ? colors.darkGrey : colors.lightGrey,
              color: isDark ? colors.white : colors.black,
              borderColor: isDark ? colors.grey : colors.lightGrey
            }
          ]}
          value={currentAnswer}
          onChangeText={(text) => {
            // Basic auto-formatting for YYYY-MM-DD
            let formatted = text.replace(/[^0-9]/g, '');
            if (formatted.length > 4) formatted = formatted.substring(0, 4) + '-' + formatted.substring(4);
            if (formatted.length > 7) formatted = formatted.substring(0, 7) + '-' + formatted.substring(7, 9);
            handleTempAnswerChange(question.id, formatted);
          }}
          placeholder="YYYY-MM-DD"
          placeholderTextColor={isDark ? colors.grey : colors.darkGrey}
          multiline={false}
          keyboardType="numeric"
          maxLength={10}
        />
      );
    }

    // Handle NUMBER type questions
    if (questionType === 'NUMBER' || questionType === 'NUMERIC') {
      return (
        <TextInput
          style={[
            styles.modalQuestionInput,
            {
              backgroundColor: isDark ? colors.darkGrey : colors.lightGrey,
              color: isDark ? colors.white : colors.black,
              borderColor: isDark ? colors.grey : colors.lightGrey
            }
          ]}
          value={currentAnswer}
          onChangeText={(text) => handleTempAnswerChange(question.id, text)}
          placeholder="Enter number"
          placeholderTextColor={isDark ? colors.grey : colors.darkGrey}
          multiline={false}
          keyboardType="numeric"
        />
      );
    }

    // Handle EMAIL type questions
    if (questionType === 'EMAIL') {
      return (
        <TextInput
          style={[
            styles.modalQuestionInput,
            {
              backgroundColor: isDark ? colors.darkGrey : colors.lightGrey,
              color: isDark ? colors.white : colors.black,
              borderColor: isDark ? colors.grey : colors.lightGrey
            }
          ]}
          value={currentAnswer}
          onChangeText={(text) => handleTempAnswerChange(question.id, text)}
          placeholder="Enter email address"
          placeholderTextColor={isDark ? colors.grey : colors.darkGrey}
          multiline={false}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      );
    }

    // Handle PHONE type questions
    if (questionType === 'PHONE' || questionType === 'PHONENUMBER') {
      return (
        <TextInput
          style={[
            styles.modalQuestionInput,
            {
              backgroundColor: isDark ? colors.darkGrey : colors.lightGrey,
              color: isDark ? colors.white : colors.black,
              borderColor: isDark ? colors.grey : colors.lightGrey
            }
          ]}
          value={currentAnswer}
          onChangeText={(text) => handleTempAnswerChange(question.id, text)}
          placeholder="Enter phone number"
          placeholderTextColor={isDark ? colors.grey : colors.darkGrey}
          multiline={false}
          keyboardType="phone-pad"
        />
      );
    }

    // Handle BOOLEAN type questions (Yes/No)
    if (questionType === 'BOOLEAN' || questionType === 'YESNO') {
      return (
        <View style={styles.optionContainer}>
          <TouchableOpacity
            style={[
              styles.optionButton,
              {
                backgroundColor: currentAnswer === 'true' || currentAnswer === 'yes'
                  ? (colors.blue || '#2196F3')
                  : (isDark ? colors.darkGrey : colors.lightGrey),
                borderColor: isDark ? colors.grey : colors.lightGrey
              }
            ]}
            onPress={() => handleTempAnswerChange(question.id, 'true')}
          >
            <TypographyText
              title="Yes"
              size={14}
              textColor={currentAnswer === 'true' || currentAnswer === 'yes' ? colors.white : (isDark ? colors.white : colors.black)}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.optionButton,
              {
                backgroundColor: currentAnswer === 'false' || currentAnswer === 'no'
                  ? (colors.blue || '#2196F3')
                  : (isDark ? colors.darkGrey : colors.lightGrey),
                borderColor: isDark ? colors.grey : colors.lightGrey
              }
            ]}
            onPress={() => handleTempAnswerChange(question.id, 'false')}
          >
            <TypographyText
              title="No"
              size={14}
              textColor={currentAnswer === 'false' || currentAnswer === 'no' ? colors.white : (isDark ? colors.white : colors.black)}
            />
          </TouchableOpacity>
        </View>
      );
    }

    // Default fallback for FREETEXT and unknown types
    return (
      <TextInput
        style={[
          styles.modalQuestionInput,
          {
            backgroundColor: isDark ? colors.darkGrey : colors.lightGrey,
            color: isDark ? colors.white : colors.black,
            borderColor: isDark ? colors.grey : colors.lightGrey
          }
        ]}
        value={currentAnswer}
        onChangeText={(text) => handleTempAnswerChange(question.id, text)}
        placeholder={getPlaceholderForQuestionType(questionType)}
        placeholderTextColor={isDark ? colors.grey : colors.darkGrey}
        multiline={questionType === 'FREETEXT' || questionType === 'TEXTAREA'}
        numberOfLines={questionType === 'FREETEXT' || questionType === 'TEXTAREA' ? 3 : 1}
        keyboardType={getKeyboardTypeForQuestionType(questionType)}
        autoCapitalize={questionType === 'EMAIL' ? 'none' : 'sentences'}
      />
    );
  };

  // Helper function to get appropriate placeholder text
  const getPlaceholderForQuestionType = (questionType) => {
    switch (questionType?.toUpperCase()) {
      case 'DATE': return 'YYYY-MM-DD';
      case 'NUMBER':
      case 'NUMERIC': return 'Enter number';
      case 'EMAIL': return 'Enter email address';
      case 'PHONE':
      case 'PHONENUMBER': return 'Enter phone number';
      case 'FREETEXT':
      case 'TEXTAREA': return t("GlobalTix.cart.enterAnswer");
      default: return t("GlobalTix.cart.enterAnswer");
    }
  };

  // Helper function to get appropriate keyboard type
  const getKeyboardTypeForQuestionType = (questionType) => {
    switch (questionType?.toUpperCase()) {
      case 'NUMBER':
      case 'NUMERIC': return 'numeric';
      case 'EMAIL': return 'email-address';
      case 'PHONE':
      case 'PHONENUMBER': return 'phone-pad';
      default: return 'default';
    }
  };

  // Modal functions
  const openQuestionsModal = useCallback((ticketTypeId, ticketTypeName) => {
    setCurrentTicketTypeId(ticketTypeId);
    setCurrentTicketTypeName(ticketTypeName);

    // Initialize temp answers with existing answers
    const questions = getQuestionsForTicketType(ticketTypeId);
    const initialAnswers = {};
    questions.forEach(question => {
      initialAnswers[question.id] = getQuestionAnswer(ticketTypeId, question.id);
    });
    setTempAnswers(initialAnswers);

    setIsQuestionsModalVisible(true);
  }, [getQuestionsForTicketType, getQuestionAnswer]);

  const closeQuestionsModal = () => {
    setIsQuestionsModalVisible(false);
    setCurrentTicketTypeId(null);
    setCurrentTicketTypeName('');
    setTempAnswers({});
  };

  const handleTempAnswerChange = (questionId, answer) => {
    setTempAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const saveQuestionAnswers = () => {
    if (currentTicketTypeId) {
      const newAnswers = { ...questionAnswers };
      Object.keys(tempAnswers).forEach(questionId => {
        newAnswers[`${currentTicketTypeId}_${questionId}`] = tempAnswers[questionId];
      });
      setQuestionAnswers(newAnswers);
    }
    closeQuestionsModal();
  };


  // Force convert existing cart items to QAR prices (using selling price with markup)
  const convertExistingCartItems = async () => {
    for (const [cartKey, item] of Object.entries(cartItems)) {
      try {
        const optionCurrency = item.option?.currency;
        const markupPercentage = GLOBALTIX_CONFIG.DEFAULT_MARKUP_PERCENTAGE;

        // Calculate selling price with markup — for dynamic price products use CEA nett price
        const ceaData = item.isDynamicPrice && item.ceaNettPrice ? { nettPrice: item.ceaNettPrice, msp: item.ceaMsp } : null;
        const pricing = getTicketSellingPrice(item.ticketType || {}, markupPercentage, ceaData);
        const sellingPrice = pricing.sellingPrice;

        if (sellingPrice > 0 && optionCurrency) {
          const convertedPriceString = await convertToQAR(sellingPrice, optionCurrency, false);
          const convertedPrice = parseFloat(convertedPriceString.replace(/[^\d.]/g, ''));

          console.log(`Converting cart item ${cartKey}: sellingPrice=${sellingPrice} ${optionCurrency} -> ${convertedPrice} QAR`);

          // Update the cart item with converted selling price
          dispatch(updateGlobalTixCartQuantityThunk({
            productId: item.productId,
            optionId: item.optionId,
            ticketTypeId: item.ticketTypeId,
            quantity: item.quantity,
            convertedPrice: convertedPrice
          }));
        }
      } catch (error) {
        console.error(`Error converting cart item ${cartKey}:`, error);
      }
    }
  };

  // Re-fetch CEA prices for dynamic products to avoid stale pricing
  const refreshDynamicPrices = async () => {
    for (const [, item] of Object.entries(cartItems)) {
      if (!item.isDynamicPrice || !item.visitDate) continue;
      try {
        const resp = await globalTixAPI.checkEventAvailability({
          ticketTypeID: item.ticketTypeId,
          dateFrom: item.visitDate,
          dateTo: item.visitDate,
        });
        const slot = Array.isArray(resp.data) && resp.data.length > 0 ? resp.data[0] : null;
        const freshNettPrice = slot?.nettPrice || null;
        if (!freshNettPrice || freshNettPrice === item.ceaNettPrice) continue;

        const ceaData = { nettPrice: freshNettPrice };
        const pricing = getTicketSellingPrice(
          item.ticketType || {},
          GLOBALTIX_CONFIG.DEFAULT_MARKUP_PERCENTAGE,
          ceaData
        );
        const optionCurrency = item.option?.currency;
        let freshQarPrice = item.price;
        if (pricing.sellingPrice > 0 && optionCurrency) {
          const converted = await convertToQAR(pricing.sellingPrice, optionCurrency, false);
          freshQarPrice = parseFloat(converted.replace(/[^\d.]/g, ''));
        }
        dispatch(updateGlobalTixCartQuantityThunk({
          productId: item.productId,
          optionId: item.optionId,
          ticketTypeId: item.ticketTypeId,
          quantity: item.quantity,
          convertedPrice: freshQarPrice,
          ceaNettPrice: freshNettPrice,
        }));
      } catch (_) {
        // Non-fatal — keep existing price if refresh fails
      }
    }
  };

  // Convert existing items when cart screen loads
  useEffect(() => {
    if (Object.keys(cartItems).length > 0) {
      convertExistingCartItems();
      refreshDynamicPrices();
    }
  }, []);

  // Populate customer information with user data when component mounts
  useEffect(() => {
    if (user) {
      const parsedPhone = parsePhoneNumber(user.phone);

      setCustomerInfo(prev => ({
        ...prev,
        firstName: user.name || '',
        lastName: user.x_moi_last_name || '',
        email: user.email || '',
        mobileCode: parsedPhone.code,
        mobileNumber: parsedPhone.number,
      }));
    }
  }, [user]);

  // Extract questions from product options when cart items change
  useEffect(() => {
    if (cartItemsArray.length > 0) {
      extractQuestionsFromOptions();
    }
  }, [cartItemsArray.length]);

  // Translate ticket and option names when cart items or language changes
  useEffect(() => {
    const translateNames = async () => {
      const currentLanguage = i18n.language;
      if (currentLanguage === 'en') {
        // No translation needed for English
        setTranslatedTicketNames({});
        setTranslatedOptionNames({});
        return;
      }

      const ticketTranslations = {};
      const optionTranslations = {};
      const uniqueTicketNames = new Set();
      const uniqueOptionNames = new Set();

      // Collect all unique ticket and option names
      cartItemsArray.forEach(item => {
        if (item.ticketType?.name) {
          uniqueTicketNames.add(item.ticketType.name);
        }
        if (item.option?.name) {
          uniqueOptionNames.add(item.option.name);
        }
      });

      // Batch translate ticket names (process in batches of 3)
      const ticketNamesArray = Array.from(uniqueTicketNames);
      const batchSize = 3;
      for (let i = 0; i < ticketNamesArray.length; i += batchSize) {
        const batch = ticketNamesArray.slice(i, i + batchSize);
        const results = await Promise.allSettled(
          batch.map(ticketName => translateText(ticketName, currentLanguage))
        );

        results.forEach((result, index) => {
          const ticketName = batch[index];
          if (result.status === 'fulfilled') {
            ticketTranslations[ticketName] = result.value;
          } else {
            console.error(`Error translating ticket name "${ticketName}":`, result.reason);
            ticketTranslations[ticketName] = ticketName; // Fallback to original
          }
        });

        // Small delay between batches to avoid rate limits
        if (i + batchSize < ticketNamesArray.length) {
          await new Promise(resolve => setTimeout(resolve, 200));
        }
      }

      // Batch translate option names (process in batches of 3)
      const optionNamesArray = Array.from(uniqueOptionNames);
      for (let i = 0; i < optionNamesArray.length; i += batchSize) {
        const batch = optionNamesArray.slice(i, i + batchSize);
        const results = await Promise.allSettled(
          batch.map(optionName => translateText(optionName, currentLanguage))
        );

        results.forEach((result, index) => {
          const optionName = batch[index];
          if (result.status === 'fulfilled') {
            optionTranslations[optionName] = result.value;
          } else {
            console.error(`Error translating option name "${optionName}":`, result.reason);
            optionTranslations[optionName] = optionName; // Fallback to original
          }
        });

        // Small delay between batches to avoid rate limits
        if (i + batchSize < optionNamesArray.length) {
          await new Promise(resolve => setTimeout(resolve, 200));
        }
      }

      setTranslatedTicketNames(ticketTranslations);
      setTranslatedOptionNames(optionTranslations);
    };

    if (cartItemsArray.length > 0) {
      translateNames();
    }
    // Use stable JSON key to avoid new array reference on every render triggering infinite loop
  }, [JSON.stringify(cartItems), i18n.language]);

  // Confirms a GlobalTix booking after payment success: confirms with GlobalTix,
  // records it locally for "My Bookings", clears the cart, and navigates back.
  const finalizeGlobalTixBooking = async (referenceNumber) => {
    console.log('[GlobalTix][finalizeBooking] START — referenceNumber:', referenceNumber);
    try {
      console.log('[GlobalTix][finalizeBooking] calling confirmBooking with:', {
        referenceNumber,
        remarks: customerInfo.remarks || '',
      });

      const confirmResult = await globalTixAPI.confirmBooking({
        referenceNumber,
        remarks: customerInfo.remarks || '',
      });

      console.log('[GlobalTix][finalizeBooking] confirmBooking response:', JSON.stringify(confirmResult, null, 2));

      if (confirmResult.success) {
        console.log('[GlobalTix][finalizeBooking] confirmBooking succeeded');
        showMessage({
          message: t("GlobalTix.cart.messages.bookingConfirmed"),
          type: "success",
          duration: 4000,
        });

        try {
          const firstItem = cartItemsArray[0];
          const existingRaw = await AsyncStorage.getItem('globaltix_my_bookings');
          const existing = existingRaw ? JSON.parse(existingRaw) : [];
          console.log('[GlobalTix][finalizeBooking] existing My Bookings entries:', existing.length);
          if (!existing.some(b => b.referenceNumber === referenceNumber)) {
            const rawTicketType = firstItem?.ticketTypeName || firstItem?.ticketType;
            const bookingRecord = {
              referenceNumber,
              productName: firstItem?.productName || firstItem?.name || 'GlobalTix Booking',
              ticketType: typeof rawTicketType === 'string' ? rawTicketType : rawTicketType?.name || null,
              visitDate: firstItem?.visitDate || firstItem?.date || null,
              isCancellable: firstItem?.isCancellable ?? false,
              status: 'CONFIRMED',
              timestamp: new Date().toISOString(),
              // The actual amount charged, in QAR — GlobalTix's own booking
              // details API only reports its settlement currency (e.g. THB),
              // so this is saved here for My Bookings to display correctly.
              amount: finalAmount,
              currency: 'QAR',
            };
            console.log('[GlobalTix][finalizeBooking] saving new My Bookings entry:', bookingRecord);
            existing.unshift(bookingRecord);
            await AsyncStorage.setItem('globaltix_my_bookings', JSON.stringify(existing));
            console.log('[GlobalTix][finalizeBooking] AsyncStorage write complete');
          } else {
            console.log('[GlobalTix][finalizeBooking] referenceNumber already saved, skipping duplicate write');
          }
        } catch (storageErr) {
          console.error('[GlobalTix][finalizeBooking] Failed to save booking to My Bookings:', storageErr);
        }
      } else {
        console.warn('[GlobalTix][finalizeBooking] confirmBooking returned success=false:', confirmResult.error);
        showMessage({
          message: t("GlobalTix.cart.messages.bookingConfirmationFailed"),
          type: "warning",
          duration: 4000,
        });
      }
    } catch (confirmError) {
      console.error('[GlobalTix][finalizeBooking] confirmBooking threw an error:', confirmError);
      showMessage({
        message: t("GlobalTix.cart.messages.bookingConfirmationFailed"),
        type: "warning",
        duration: 4000,
      });
    }

    console.log('[GlobalTix][finalizeBooking] clearing cart and payment data, navigating back in 2s');
    dispatch(clearGlobalTixCartThunk());
    dispatch(setGlobalTixPaymentData(null));

    setTimeout(() => {
      console.log('[GlobalTix][finalizeBooking] navigation.goBack()');
      navigation.goBack();
    }, 2000);
  };

  // Check payment status when returning from payment gateway (similar to Cardmola)
  useFocusEffect(
    useCallback(() => {
      // Get payment data from Redux state instead of local state
      const globalTixPaymentData = store.getState().globalTix.paymentDataGlobal;

      async function checkPaymentStatus() {
        const currentPaymentData = paymentData || globalTixPaymentData;
        console.log('[GlobalTix][checkPaymentStatus] START — currentPaymentData:', currentPaymentData);

        if (currentPaymentData && currentPaymentData.referenceNumber) {
          try {
            console.log('[GlobalTix][checkPaymentStatus] calling checkGlobalTixPaymentStatus with:', {
              record_ref_number: currentPaymentData.record_ref_number,
              referenceNumber: currentPaymentData.referenceNumber,
            });

            const data = await checkGlobalTixPaymentStatus(
              currentPaymentData.record_ref_number,
              currentPaymentData.referenceNumber
            );

            console.log('[GlobalTix][checkPaymentStatus] response:', JSON.stringify(data, null, 2));

            if (data.payment_status === "Paid" || data.status === "CONFIRMED") {
              console.log('[GlobalTix][checkPaymentStatus] status = Paid/CONFIRMED — finalizing booking');
              await finalizeGlobalTixBooking(currentPaymentData.referenceNumber);
            } else if (data.payment_status === "Failed" || data.payment_status === "fail" || data.status === "FAILED") {
              console.warn('[GlobalTix][checkPaymentStatus] status = Failed — releasing booking:', currentPaymentData.referenceNumber);
              // Release the booking when payment fails to free up the slots
              try {
                const releaseResult = await globalTixAPI.releaseBooking({
                  referenceNumber: currentPaymentData.referenceNumber,
                  // Add any other required release parameters based on GlobalTix API documentation
                });

                console.log('[GlobalTix][checkPaymentStatus] releaseBooking result:', releaseResult);
                if (!releaseResult.success) {
                  console.error("Failed to release booking:", releaseResult.error);
                }
              } catch (releaseError) {
                console.error("Error releasing booking after payment failure:", releaseError);
                // Don't show error to user as payment failure is already handled
              }

              // Clear payment data from Redux
              dispatch(setGlobalTixPaymentData(null));

              // Show payment failed message AFTER releasing the booking
              showMessage({
                message: t("GlobalTix.cart.messages.paymentFailed"),
                type: "danger",
                duration: 4000,
              });
            } else {
              console.log('[GlobalTix][checkPaymentStatus] status still processing, not clearing payment data:', data.payment_status || data.status);
            }

            // Clear local payment data after checking
            setPaymentData(null);
          } catch (err) {
            // Payment status endpoint may not be implemented yet on backend — fail silently
            // to avoid showing confusing error messages to users after a successful payment.
            console.warn('[GlobalTix][checkPaymentStatus] skipped due to error:', err.message);
          }
        } else {
          console.log('[GlobalTix][checkPaymentStatus] no pending payment data — nothing to check');
        }
      }

      // Add a small delay to ensure the screen is fully loaded
      const timer = setTimeout(() => {
        checkPaymentStatus();
      }, 500);

      return () => clearTimeout(timer);
    }, [navigation, paymentData])
  );

  // Send booking data to backend for payment processing
  const sendBookingToBackend = async (globalTixResponse, ticketDetails, customerInfo, totalPrice, bankCharge, finalAmount, selectedPaymentMethod) => {
    try {

      const token = await getToken();

      // Validate required data
      if (!token) {
        throw new Error("Authentication token is missing");
      }

      if (!globalTixResponse?.data?.referenceNumber) {
        throw new Error("Reference number is missing from booking response");
      }

      if (!customerInfo?.email) {
        throw new Error("Customer email is required");
      }

      if (!customerInfo?.lastName) {
        throw new Error("Customer last name is required");
      }

      if (!ticketDetails || ticketDetails.length === 0) {
        throw new Error("Ticket details are required");
      }

      if (!totalPrice || totalPrice <= 0) {
        throw new Error("Valid total price is required");
      }

      if (!selectedPaymentMethod) {
        throw new Error("Payment method is required");
      }

      const backendPayload = {
        "params": {
          "token": token,
          "globalTixBooking": {
            "referenceNumber": globalTixResponse.data.referenceNumber,
            "bookingTime": globalTixResponse.data.bookingTime,
            "amount": formatMonetaryValue(totalPrice),
            "customer": `${customerInfo.firstName} ${customerInfo.lastName}`.trim(),
            "email": customerInfo.email,
            "status": globalTixResponse.data.status,
            "origin_currency": globalTixResponse.data.currency || "THB",
            "origin_total": formatMonetaryValue(globalTixResponse.data.totalPrice || totalPrice)
          },
          "customerInfo": {
            "customerName": `${customerInfo.firstName} ${customerInfo.lastName}`.trim(),
            "email": customerInfo.email,
            "alternateEmail": customerInfo.alternateEmail || "",
            "mobileNumber": customerInfo.mobileNumber || "",
            "mobilePrefix": customerInfo.mobileCode || "",
            "passportNumber": customerInfo.nricPassport || "",
            "partnerReference": customerInfo.partnerReference || "",
            "remarks": customerInfo.remarks || ""
          },
          "ticketDetails": ticketDetails.map(ticket => ({
            ...ticket,
            price: formatMonetaryValue(ticket.price)
          })),
          "paymentInfo": {
            "paymentMethod": selectedPaymentMethod,
            "subTotal": formatMonetaryValue(totalPrice),
            "bankCharge": formatMonetaryValue(bankCharge),
            "finalAmount": formatMonetaryValue(finalAmount),
            "currency": "QAR",
            "returnUrl": "https://globaltixpaystatus.com/"
          },
          "metadata": {
            "source": `${org.displayName} App`,
            "timestamp": new Date().toISOString(),
            "appVersion": "1.0.0"
          }
        }
      };
      console.log('[GlobalTix][sendBookingToBackend] POST /go/api/user/payment/request/globaltix payload:', JSON.stringify(backendPayload, null, 2));
      const response = await axios.post(
        `https://${org.baseUrl}/go/api/user/payment/request/globaltix`,
        backendPayload
      );

      console.log('[GlobalTix][sendBookingToBackend] response:', JSON.stringify(response.data, null, 2));
      if (response.data?.error) {
        throw new Error(`Payment processing failed: ${response.data.error}`);
      }

      if (!response.data?.result) {
        throw new Error("Payment link generation failed - no result in response");
      }

      const backendResponse = response.data.result;

      // Validate that we have the necessary response fields
      if (!backendResponse.payment_web_link && !backendResponse.payment_link && !backendResponse.payUrl) {
        throw new Error("Payment link generation failed - no payment link in response");
      }

      console.log('[GlobalTix][sendBookingToBackend] resolved backendResponse:', backendResponse);
      return backendResponse;

    } catch (error) {
      console.error('[GlobalTix][sendBookingToBackend] failed:', error.message, error.response?.data || '');
      throw error;
    }
  };

  const handleCheckout = async () => {
    console.log('[GlobalTix][checkout] handleCheckout START', {
      totalPrice, bankCharge, finalAmount, selectedPaymentMethod, customerInfo,
    });

    // Validate required fields
    if (!customerInfo.lastName || !customerInfo.email || !customerInfo.mobileNumber) {
      console.warn('[GlobalTix][checkout] blocked — missing required customer fields', {
        lastName: customerInfo.lastName, email: customerInfo.email, mobileNumber: customerInfo.mobileNumber,
      });
      Alert.alert(t('General.error'), t('GlobalTix.cart.requiredFields'));
      return;
    }

    // Validate Q&A for all items in the cart
    let hasUnansweredQuestions = false;
    let firstUnansweredQuestion = null;

    Object.values(cartItems).forEach(item => {
      const ticketTypeId = item.ticketTypeId;
      const questions = getQuestionsForTicketType(ticketTypeId);

      questions.forEach(q => {
        if (q.isRequired) {
          const answer = getQuestionAnswer(ticketTypeId, q.id);
          if (!answer || answer.trim() === '') {
            hasUnansweredQuestions = true;
            if (!firstUnansweredQuestion) firstUnansweredQuestion = q.question;
          }
        }
      });
    });

    if (hasUnansweredQuestions) {
      Alert.alert(
        t('General.error'),
        `Please answer all compulsory questions. Missing: "${firstUnansweredQuestion}"`
      );
      return;
    }

    try {
      setLoading(true);

      // Check if all cart items have visiting dates
      console.log('=== Cart Items Debug ===');
      console.log('All cart items:', cartItems);
      console.log('Cart items values:', Object.values(cartItems));

      const itemsWithoutVisitDate = Object.values(cartItems).filter(item => !item.visitDate);
      console.log('Items without visit date:', itemsWithoutVisitDate);

      // Log ticket type details for debugging
      Object.values(cartItems).forEach(item => {
        console.log('Ticket type details:', {
          productId: item.productId,
          productName: item.product?.name,
          ticketTypeId: item.ticketTypeId,
          ticketTypeName: item.ticketType?.name,
          visitDate: item.visitDate
        });
      });

      if (itemsWithoutVisitDate.length > 0) {
        Alert.alert(
          t("GlobalTix.cart.alerts.missingVisitDate"),
          t("GlobalTix.cart.alerts.missingVisitDateMessage"),
          [{ text: t("GlobalTix.cart.buttons.ok") }]
        );
        setLoading(false);
        return;
      }

      // Prepare ticket types from cart items
      const ticketTypes = Object.values(cartItems).map((item, index) => {
        // Validate ticket type ID
        if (!item.ticketTypeId || isNaN(item.ticketTypeId)) {
          throw new Error(`Invalid ticket type ID: ${item.ticketTypeId}`);
        }

        // Additional validation for ticket type ID
        const ticketTypeId = parseInt(item.ticketTypeId);
        if (ticketTypeId <= 0) {
          throw new Error(`Invalid ticket type ID: ${ticketTypeId}. Please try again.`);
        }

        // Format the visit date to ensure it's in the correct format
        const visitDate = item.visitDate;
        const formattedVisitDate = visitDate ? new Date(visitDate).toISOString().split('T')[0] : null;

        // Build question list with answers in the correct GlobalTix API format
        const questions = getQuestionsForTicketType(ticketTypeId);
        const questionList = questions
          .filter(question => {
            const answer = getQuestionAnswer(ticketTypeId, question.id);
            return answer && answer.trim() !== ''; // Only include questions with answers
          })
          .map(question => {
            const answer = getQuestionAnswer(ticketTypeId, question.id);
            console.log(`Building question for ticket ${ticketTypeId}:`, {
              questionId: question.id,
              question: question.question,
              answer: answer,
              questionCode: question.questionCode
            });

            return {
              id: question.id,
              answer: answer,
              ticketIndex: index, // This should be the ticket type index
              questionCode: question.questionCode || question.code || null
            };
          });

        // For dynamic price products, send the markup-applied selling price (not raw nett price)
        let dynamicSellingPrice = null;
        if (item.isDynamicPrice && item.ceaNettPrice) {
          const ceaData = { nettPrice: item.ceaNettPrice };
          const dynamicPricing = getTicketSellingPrice(
            item.ticketType || {},
            GLOBALTIX_CONFIG.DEFAULT_MARKUP_PERCENTAGE,
            ceaData
          );
          dynamicSellingPrice = dynamicPricing.sellingPrice > 0 ? dynamicPricing.sellingPrice : null;
        }

        const ticketType = {
          id: ticketTypeId,
          quantity: parseInt(item.quantity),
          sellingPrice: dynamicSellingPrice,
          visitDate: formattedVisitDate,
          index: index,
          questionList: questionList,
          event_id: item.eventId || null,
          packageItems: [],
          visitDateSettings: []
        };

        // Include visitTime for timeslot tickets (extracted from the slot's time field)
        if (item.timeSlot) {
          const timePart = item.timeSlot.includes('T')
            ? item.timeSlot.split('T')[1].substring(0, 8)
            : item.timeSlot;
          ticketType.visitTime = timePart;
        }


        return ticketType;
      });


      // Create reserve payload according to GlobalTix API
      const reservePayload = {
        customerName: `${customerInfo.firstName} ${customerInfo.lastName}`.trim(),
        email: customerInfo.email,
        alternateEmail: customerInfo.alternateEmail || undefined,
        mobileNumber: customerInfo.mobileNumber || undefined,
        mobilePrefix: customerInfo.mobileCode || undefined,
        passportNumber: customerInfo.nricPassport || undefined,
        paymentMethod: selectedPaymentMethod,
        // Remove creditCardCurrencyId if it's null
        ...(selectedPaymentMethod === 'CREDIT_CARD' && { creditCardCurrencyId: null }),
        groupName: undefined,
        groupBooking: false,
        groupNoOfMember: ticketTypes.reduce((sum, t) => sum + (t.quantity || 1), 0),
        otherInfo: {
          partnerReference: customerInfo.partnerReference || undefined
        },
        remarks: customerInfo.remarks || undefined,
        ticketTypes: ticketTypes
      };

      // Remove undefined values from the payload
      const cleanPayload = JSON.parse(JSON.stringify(reservePayload, (key, value) => {
        return value === undefined ? undefined : value;
      }));


      // Validate payload before sending
      if (!cleanPayload.customerName || !cleanPayload.email) {
        throw new Error('Missing required customer information');
      }

      if (!cleanPayload.ticketTypes || cleanPayload.ticketTypes.length === 0) {
        throw new Error('No ticket types in payload');
      }

      if (cleanPayload.ticketTypes.some(t => !t.id || !t.quantity)) {
        throw new Error('Invalid ticket type data');
      }

      // Validate that all ticket types have visit dates
      if (cleanPayload.ticketTypes.some(t => !t.visitDate)) {
        throw new Error('Visit date is required for all ticket types');
      }

      // Validate that all ticket types have event_id
      // event_id can be null as per GlobalTix API example

      // Validate date format consistency
      const invalidDateFormats = cleanPayload.ticketTypes.filter(t => {
        if (!t.visitDate) return false;
        // Check if date is in YYYY-MM-DD format
        return !/^\d{4}-\d{2}-\d{2}$/.test(t.visitDate);
      });

      if (invalidDateFormats.length > 0) {
        throw new Error('Invalid date format detected. Please try again.');
      }

      // Validate ticket type consistency (event_id can be null)
      const invalidTicketTypes = cleanPayload.ticketTypes.filter(t => {
        // Check if ticket type ID is valid
        return !t.id || !Number.isInteger(t.id) || t.id <= 0;
      });

      if (invalidTicketTypes.length > 0) {
        console.error('Invalid ticket type IDs:', invalidTicketTypes);
        throw new Error('Invalid ticket type data detected. Please try again.');
      }

      // Debug: Log all available IDs from cart items
      console.log('=== DEBUGGING AVAILABLE IDs ===');
      Object.values(cartItems).forEach((item, index) => {
        console.log(`Cart Item ${index}:`, {
          productId: item.productId,
          optionId: item.optionId,
          ticketTypeId: item.ticketTypeId,
          product: item.product ? {
            id: item.product.id,
            name: item.product.name
          } : 'No product data',
          option: item.option ? {
            id: item.option.id,
            name: item.option.name
          } : 'No option data',
          ticketType: item.ticketType ? {
            id: item.ticketType.id,
            name: item.ticketType.name
          } : 'No ticket type data'
        });

        // Log the complete item structure to see if there are other IDs
        console.log(`Complete Cart Item ${index} structure:`, JSON.stringify(item, null, 2));

        // Log the attraction ID that will be used as event_id
        if (item.product && item.product.howToUseList && item.product.howToUseList[0] && item.product.howToUseList[0].attraction) {
          console.log(`Attraction ID for Cart Item ${index}: ${item.product.howToUseList[0].attraction.id}`);
        } else {
          console.log(`No attraction ID found for Cart Item ${index}, using product ID: ${item.product.id}`);
        }
      });

      // Additional validation: Check if the ticket type ID exists in our cart
      console.log('=== VALIDATING TICKET TYPE COMBINATIONS ===');
      cleanPayload.ticketTypes.forEach((ticketType, index) => {
        const cartItem = Object.values(cartItems).find(item =>
          item.ticketTypeId === ticketType.id
        );

        if (!cartItem) {
          console.error(`Ticket type ${ticketType.id} not found in cart`);
          throw new Error(`Invalid ticket type detected. Please refresh and try again.`);
        }

        console.log(`✅ Valid ticket type: ${ticketType.id} with event_id: ${ticketType.event_id}`);
      });

      // Pre-booking availability check to validate ticket types are still valid
      try {
        console.log('=== PRE-BOOKING AVAILABILITY CHECK ===');

        // Group items by visiting date for efficient checking
        const itemsByDate = {};
        Object.values(cartItems).forEach(item => {
          if (!itemsByDate[item.visitDate]) {
            itemsByDate[item.visitDate] = [];
          }
          itemsByDate[item.visitDate].push(item);
        });

        console.log('Items grouped by date:', itemsByDate);

        // Check availability for each date
        for (const [visitDate, items] of Object.entries(itemsByDate)) {
          const optionIds = items.map(item => item.optionId);
          console.log(`Checking availability for date ${visitDate} with optionIds:`, optionIds);

          const availabilityResponse = await globalTixAPI.checkCalendarAvailability({
            optionIds: optionIds,
            date: visitDate,
            pullAll: true
          });

          console.log(`Availability response for ${visitDate}:`, availabilityResponse);

          if (availabilityResponse.success && availabilityResponse.data) {
            const unavailableOptions = availabilityResponse.data.filter(item => item.status !== 'available');
            console.log(`Unavailable options for ${visitDate}:`, unavailableOptions);

            // Check if any of our specific ticket types are unavailable
            const unavailableTicketTypes = [];
            availabilityResponse.data.forEach(availabilityItem => {
              const cartItem = items.find(item => item.optionId === availabilityItem.optionId);
              if (cartItem && availabilityItem.status !== 'available') {
                unavailableTicketTypes.push({
                  optionId: availabilityItem.optionId,
                  ticketTypeId: cartItem.ticketTypeId,
                  status: availabilityItem.status,
                  message: availabilityItem.message
                });
              }
            });

            console.log(`Unavailable ticket types for ${visitDate}:`, unavailableTicketTypes);

            if (unavailableTicketTypes.length > 0) {
              throw new Error(`Some selected tickets are no longer available for ${visitDate}. Please try again.`);
            }
          }
        }

        console.log('✅ Pre-booking availability check passed');
      } catch (availabilityError) {
        console.log('❌ Pre-booking availability check failed:', availabilityError.message);
        // Don't throw here, just log the error and proceed
        // The booking API will handle the validation
      }

      // Call GlobalTix booking API
      console.log('=== CALLING BOOKING API ===');
      console.log('Final payload being sent to booking API:', JSON.stringify(cleanPayload, null, 2));

      // Debug questionList specifically
      console.log('=== QUESTION LIST DEBUG ===');
      cleanPayload.ticketTypes.forEach((ticketType, idx) => {
        console.log(`Ticket Type ${idx}:`, {
          id: ticketType.id,
          quantity: ticketType.quantity,
          questionList: ticketType.questionList
        });
      });

      const bookingResponse = await globalTixAPI.createBooking(cleanPayload);

      console.log('=== BOOKING API RESPONSE ===');
      console.log('Booking response:', JSON.stringify(bookingResponse, null, 2));
      console.log('Success:', bookingResponse.success);
      console.log('Data:', bookingResponse.data);
      console.log('Error:', bookingResponse.error);

      // Enhanced error handling for booking response
      if (bookingResponse.success && bookingResponse.data) {
        const bookingData = bookingResponse.data;


        // Prepare ticket details for backend
        const ticketDetails = Object.values(cartItems).map((item) => ({
          productId: item.productId,
          optionId: item.optionId,
          ticketTypeId: item.ticketTypeId,
          ticketTypeName: item.ticketType.name,
          quantity: item.quantity,
          price: item.price,
          visitDate: item.visitDate // Use the visiting date from cart item
        }));

        try {
          console.log('[GlobalTix][checkout] ticketDetails built for backend:', JSON.stringify(ticketDetails, null, 2));
          console.log('[GlobalTix][checkout] calling sendBookingToBackend with:', JSON.stringify({
            bookingResponse, ticketDetails, customerInfo, totalPrice, bankCharge, finalAmount, selectedPaymentMethod
          }, null, 2));
          // Send to backend for payment processing
          const backendResponse = await sendBookingToBackend(
            bookingResponse,
            ticketDetails,
            customerInfo,
            totalPrice,
            bankCharge,
            finalAmount,
            selectedPaymentMethod
          );
          console.log('[GlobalTix][checkout] sendBookingToBackend response:', JSON.stringify(backendResponse, null, 2));
          // Store payment data for status checking (similar to Cardmola)
          const paymentInfo = {
            record_ref_number: backendResponse.record_ref_number,
            referenceNumber: backendResponse.reference_id || bookingData.referenceNumber,
            payment_id: backendResponse.payment_id,
            payment_link: backendResponse.payment_link || backendResponse.payUrl,
            state: backendResponse.state
          };
          console.log('[GlobalTix][checkout] paymentInfo:', paymentInfo);

          dispatch(setGlobalTixPaymentData(paymentInfo));
          setPaymentData(paymentInfo);

          // Navigate to payment gateway (same pattern as Cardmola)
          const paymentUrl = backendResponse.payment_web_link || backendResponse.payment_link || backendResponse.payUrl;
          console.log('[GlobalTix][checkout] resolved paymentUrl:', paymentUrl);

          if (paymentUrl) {
            console.log('[GlobalTix][checkout] navigating to SkipCash payment WebView:', paymentUrl);
            navigation.navigate("Website", {
              url: paymentUrl,
              title: "Payment",
            });
          } else {
            Alert.alert(
              t("GlobalTix.cart.messages.paymentLinkMissing"),
              t("GlobalTix.cart.messages.paymentLinkMissingMessage"),
              [{ text: t("GlobalTix.cart.buttons.ok") }]
            );
          }

        } catch (backendError) {

          // Show warning but still allow user to proceed
          Alert.alert(
            t("GlobalTix.cart.messages.bookingReserved"),
            `${t("GlobalTix.cart.messages.bookingReservedMessage")}\n\nReference Number: ${bookingData.referenceNumber}\nSub Total: ${formatCurrency(totalPrice)}\nBank Charge: ${formatCurrency(bankCharge)}\nFinal Amount: ${formatCurrency(finalAmount)}\nStatus: ${bookingData.status}\n\nNote: There was an issue with payment processing. Please contact support.`,
            [
              {
                text: t("GlobalTix.cart.buttons.ok"),
                onPress: () => {
                  dispatch(clearGlobalTixCartThunk());
                  navigation.goBack();
                }
              }
            ]
          );
        }
      } else {
        const errorCode = bookingResponse.error?.code || 'UNKNOWN_ERROR';
        const errorMsg = bookingResponse.error?.message || bookingResponse.error || 'Failed to create booking';
        const errorDetails = bookingResponse.error?.errorDetails || null;

        // Log detailed error information for debugging
        console.error('=== BOOKING ERROR DEBUG ===');
        console.error('Full booking response:', JSON.stringify(bookingResponse, null, 2));
        console.error('Error Code:', errorCode);
        console.error('Error Message:', errorMsg);
        console.error('Error Details:', errorDetails);
        console.error('Request Payload:', JSON.stringify(cleanPayload, null, 2));

        // Provide more specific error messages based on error code
        let userFriendlyMessage = errorMsg;
        let shouldClearCart = false;

        if (errorCode === 'error.insufficient.balance') {
          userFriendlyMessage = `We are unable to complete your booking at this time. Please contact ${org.displayName} support team at ${org.supportEmail} for assistance.`;
        } else if (errorCode === 'unknown.error') {
          userFriendlyMessage = 'The booking request could not be processed. Please check your information and try again.';
        } else if (errorCode === 'validation.error') {
          userFriendlyMessage = 'Please check your booking information and try again.';
        } else if (errorCode === 'availability.error') {
          userFriendlyMessage = 'The selected tickets are no longer available. Please try again.';
          shouldClearCart = true;
        } else if (errorCode === 'error.no.event') {
          userFriendlyMessage = 'The selected event or ticket type is no longer available. Please try again.';
          shouldClearCart = true;
        } else if (errorCode === 'error.invalid.ticket.type') {
          userFriendlyMessage = 'Invalid ticket type selected. Please try again.';
          shouldClearCart = true;
        } else if (errorCode === 'error.event.not.found') {
          userFriendlyMessage = 'The event could not be found. Please try again.';
          shouldClearCart = true;
        } else if (errorCode === 'error.invalid.param') {
          userFriendlyMessage = 'Invalid booking parameters detected. This may be due to expired ticket types or invalid event data. Please try again.';
          shouldClearCart = true;
        } else if (!errorMsg || errorMsg === '') {
          // If error message is empty, provide a generic message based on error code
          userFriendlyMessage = `Booking failed with error: ${errorCode}. Please try again or contact support.`;
        }

        // Clear cart if the error indicates stale data
        if (shouldClearCart) {
          dispatch(clearGlobalTixCartThunk());
        }

        throw new Error(userFriendlyMessage);
      }

    } catch (error) {
      console.error('[GlobalTix][checkout] handleCheckout FAILED:', error.message, error);
      // Show error alert
      Alert.alert(t('General.error'), `${t("GlobalTix.cart.messages.checkoutError")}: ${error.message}`);
    } finally {
      console.log('[GlobalTix][checkout] handleCheckout END');
      setLoading(false);
    }
  };




  const toggleItemSelection = useCallback((cartKey) => {
    setSelectedItems(prev => ({
      ...prev,
      [cartKey]: !prev[cartKey]
    }));
  }, []);

  const handleRemoveSelectedItems = () => {
    const selectedKeys = Object.keys(selectedItems).filter(key => selectedItems[key]);
    selectedKeys.forEach(key => {
      const [productId, optionId, ticketTypeId] = key.split('_');
      handleRemoveItem(productId, optionId, ticketTypeId);
    });
    setSelectedItems({});
  };

  if (totalQuantity === 0) {
    return (
      <MainLayout
        outsideScroll={true}
        headerChildren={<Header label={t("GlobalTix.cart.title")} btns={["back"]} />}
        headerHeight={50}
        contentStyle={{ height: SCREEN_HEIGHT - 120, paddingHorizontal: 20 }}
      >
        <View style={styles.emptyContainer}>
          <TypographyText
            title="🛒"
            size={48}
            style={styles.emptyIcon}
          />
          <TypographyText
            title={t("GlobalTix.cart.emptyCart")}
            size={18}
            font={BALOO_SEMIBOLD}
            textColor={isDark ? colors.white : colors.darkBlue}
            style={styles.emptyTitle}
          />
          <TypographyText
            title={t("GlobalTix.cart.emptyCartSubtitle")}
            size={14}
            textColor={isDark ? colors.lightGrey : colors.grey}
            style={styles.emptySubtitle}
          />
        </View>
      </MainLayout>
    );
  }

  return (
    <MainLayout
      outsideScroll={true}
      headerChildren={<Header label={t("GlobalTix.cart.title")} btns={["back"]} />}
      headerHeight={50}
      contentStyle={{ height: SCREEN_HEIGHT - 120, paddingHorizontal: 20 }}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Cart Summary */}
        <View style={[
          styles.summaryCard,
          { backgroundColor: isDark ? colors.darkBlue : colors.white }
        ]}>
          <TypographyText
            title={t("GlobalTix.cart.youHaveItems", { count: totalQuantity })}
            size={16}
            font={BALOO_SEMIBOLD}
            textColor={isDark ? colors.white : colors.darkBlue}
            style={styles.cartSummary}
          />

          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.removeButton}
              onPress={handleRemoveSelectedItems}
            >
              <TypographyText
                title={t("GlobalTix.cart.removeSelected")}
                size={14}
                textColor={colors.white}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.clearButton}
              onPress={handleClearCart}
            >
              <TypographyText
                title={t("GlobalTix.cart.clearCart")}
                size={14}
                textColor={colors.white}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Products Section */}
        <View style={[
          styles.productsCard,
          { backgroundColor: isDark ? colors.darkBlue : colors.white }
        ]}>
          <View style={styles.productsHeader}>
            <View style={styles.checkboxContainer}>
              <View style={[
                styles.checkbox,
                { backgroundColor: cartItemsArray.length > 0 ? colors.darkBlue || '#1976D2' : 'transparent' }
              ]}>
                {cartItemsArray.length > 0 && (
                  <TypographyText title="✓" size={12} textColor={colors.white} />
                )}
              </View>
            </View>
            <TypographyText
              title={t("GlobalTix.cart.products")}
              size={16}
              font={BALOO_SEMIBOLD}
              textColor={isDark ? colors.white : colors.darkBlue}
            />
          </View>

          {cartItemsArray.map((item) => {
            const cartKey = `${item.productId}_${item.optionId}_${item.ticketTypeId}`;
            const isSelected = selectedItems[cartKey] || false;
            const itemTotal = (item.price || 0) * item.quantity;
            const translatedTicketName = translatedTicketNames[item.ticketType.name] || item.ticketType.name;
            const translatedOptionName = translatedOptionNames[item.option.name] || item.option.name;
            const hasQuestions = getQuestionsForTicketType(item.ticketTypeId).length > 0;

            return (
              <CartItemCard
                key={cartKey}
                item={item}
                cartKey={cartKey}
                isSelected={isSelected}
                itemTotal={itemTotal}
                isDark={isDark}
                translatedTicketName={translatedTicketName}
                translatedOptionName={translatedOptionName}
                hasQuestions={hasQuestions}
                t={t}
                onToggleSelect={toggleItemSelection}
                onQuantityChange={handleUpdateQuantity}
                onOpenQuestions={openQuestionsModal}
              />
            );
          })}
        </View>

        {/* Payment Details */}
        <View style={[
          styles.paymentCard,
          { backgroundColor: isDark ? colors.darkBlue : colors.white }
        ]}>
          <View style={styles.paymentSummary}>
            <View style={styles.summaryRow}>
              <TypographyText
                title={t("GlobalTix.cart.subTotal")}
                size={14}
                textColor={isDark ? colors.lightGrey : colors.grey}
              />
              <TypographyText
                title={formatCurrency(totalPrice || 0)}
                size={14}
                textColor={isDark ? colors.white : colors.black}
              />
            </View>
            <View style={styles.summaryRow}>
              <TypographyText
                title={t("GlobalTix.cart.bankCharge")}
                size={14}
                textColor={isDark ? colors.lightGrey : colors.grey}
              />
              <TypographyText
                title={formatCurrency(bankCharge)}
                size={14}
                textColor={isDark ? colors.white : colors.black}
              />
            </View>
            <View style={[styles.summaryRow, styles.totalRow]}>
              <TypographyText
                title={t("GlobalTix.cart.totalQAR")}
                size={18}
                font={BALOO_SEMIBOLD}
                textColor={colors.pink}
              />
              <TypographyText
                title={formatCurrency(finalAmount)}
                size={18}
                font={BALOO_SEMIBOLD}
                textColor={isDark ? colors.white : colors.black}
              />
            </View>
          </View>
        </View>

        {/* Customer Information Form */}
        <View style={[
          styles.formSection,
          { backgroundColor: isDark ? colors.darkBlue : colors.white }
        ]}>
          <TypographyText
            title={t("GlobalTix.cart.customerInformation")}
            size={18}
            font={BALOO_SEMIBOLD}
            textColor={isDark ? colors.white : colors.darkBlue}
            style={styles.sectionTitle}
          />

          <View style={styles.inputRow}>
            <View style={styles.inputContainer}>
              <TypographyText
                title={t("GlobalTix.cart.firstNameOptional")}
                size={14}
                textColor={isDark ? colors.lightGrey : colors.grey}
                style={styles.inputLabel}
              />
              <TextInput
                style={[
                  styles.textInput,
                  {
                    backgroundColor: isDark ? colors.navyBlue : colors.lightGrey,
                    color: isDark ? colors.white : colors.black
                  }
                ]}
                value={customerInfo.firstName}
                onChangeText={(text) => setCustomerInfo(prev => ({ ...prev, firstName: text }))}
                placeholder={t("GlobalTix.cart.placeholders.enterFirstName")}
                placeholderTextColor={isDark ? colors.lightGrey : colors.grey}
              />
            </View>
          </View>
          <View style={styles.inputRow}>
            <View style={styles.inputContainer}>
              <TypographyText
                title={t("GlobalTix.cart.lastName")}
                size={14}
                textColor={isDark ? colors.lightGrey : colors.grey}
                style={styles.inputLabel}
              />
              <TextInput
                style={[
                  styles.textInput,
                  {
                    backgroundColor: isDark ? colors.navyBlue : colors.lightGrey,
                    color: isDark ? colors.white : colors.black
                  }
                ]}
                value={customerInfo.lastName}
                onChangeText={(text) => setCustomerInfo(prev => ({ ...prev, lastName: text }))}
                placeholder={t("GlobalTix.cart.placeholders.enterLastName")}
                placeholderTextColor={isDark ? colors.lightGrey : colors.grey}
              />
            </View>
          </View>



          <View style={styles.inputRow}>
            <View style={styles.inputContainer}>
              <TypographyText
                title={t("GlobalTix.cart.email")}
                size={14}
                textColor={isDark ? colors.lightGrey : colors.grey}
                style={styles.inputLabel}
              />
              <TextInput
                style={[
                  styles.textInput,
                  {
                    backgroundColor: isDark ? colors.navyBlue : colors.lightGrey,
                    color: isDark ? colors.white : colors.black
                  }
                ]}
                value={customerInfo.email}
                onChangeText={(text) => setCustomerInfo(prev => ({ ...prev, email: text }))}
                placeholder={t("GlobalTix.cart.placeholders.enterEmail")}
                placeholderTextColor={isDark ? colors.lightGrey : colors.grey}
                keyboardType="email-address"
              />
            </View>
          </View>

          <View style={styles.inputRow}>
            <View style={styles.inputContainer}>
              <TypographyText
                title={t("GlobalTix.cart.alternateEmailOptional")}
                size={14}
                textColor={isDark ? colors.lightGrey : colors.grey}
                style={styles.inputLabel}
              />
              <TextInput
                style={[
                  styles.textInput,
                  {
                    backgroundColor: isDark ? colors.navyBlue : colors.lightGrey,
                    color: isDark ? colors.white : colors.black
                  }
                ]}
                value={customerInfo.alternateEmail}
                onChangeText={(text) => setCustomerInfo(prev => ({ ...prev, alternateEmail: text }))}
                placeholder={t("GlobalTix.cart.placeholders.enterAlternateEmail")}
                placeholderTextColor={isDark ? colors.lightGrey : colors.grey}
                keyboardType="email-address"
              />
            </View>
          </View>

          <View style={styles.inputRow}>
            <View style={styles.inputContainer}>
              <TypographyText
                title={t("GlobalTix.cart.nricPassportOptional")}
                size={14}
                textColor={isDark ? colors.lightGrey : colors.grey}
                style={styles.inputLabel}
              />
              <TextInput
                style={[
                  styles.textInput,
                  {
                    backgroundColor: isDark ? colors.navyBlue : colors.lightGrey,
                    color: isDark ? colors.white : colors.black
                  }
                ]}
                value={customerInfo.nricPassport}
                onChangeText={(text) => setCustomerInfo(prev => ({ ...prev, nricPassport: text }))}
                placeholder={t("GlobalTix.cart.placeholders.enterNricPassport")}
                placeholderTextColor={isDark ? colors.lightGrey : colors.grey}
              />
            </View>
          </View>

          <View style={styles.inputRow}>
            <View style={[styles.inputContainer, { flex: 0.3 }]}>
              <TypographyText
                title={t("GlobalTix.cart.code")}
                size={14}
                textColor={isDark ? colors.lightGrey : colors.grey}
                style={styles.inputLabel}
              />
              <TextInput
                style={[
                  styles.textInput,
                  {
                    backgroundColor: isDark ? colors.navyBlue : colors.lightGrey,
                    color: isDark ? colors.white : colors.black
                  }
                ]}
                value={customerInfo.mobileCode}
                onChangeText={(text) => setCustomerInfo(prev => ({ ...prev, mobileCode: text }))}
                placeholder="+974"
                placeholderTextColor={isDark ? colors.lightGrey : colors.grey}
              />
            </View>
            <View style={[styles.inputContainer, { flex: 0.7, marginLeft: 12 }]}>
              <TypographyText
                title={t("GlobalTix.cart.mobileNumber")}
                size={14}
                textColor={isDark ? colors.lightGrey : colors.grey}
                style={styles.inputLabel}
              />
              <TextInput
                style={[
                  styles.textInput,
                  {
                    backgroundColor: isDark ? colors.navyBlue : colors.lightGrey,
                    color: isDark ? colors.white : colors.black
                  }
                ]}
                value={customerInfo.mobileNumber}
                onChangeText={(text) => setCustomerInfo(prev => ({ ...prev, mobileNumber: text }))}
                placeholder={t("GlobalTix.cart.placeholders.enterMobileNumber")}
                placeholderTextColor={isDark ? colors.lightGrey : colors.grey}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          <View style={styles.inputRow}>
            <View style={styles.inputContainer}>
              <TypographyText
                title={t("GlobalTix.cart.partnerReferenceOptional")}
                size={14}
                textColor={isDark ? colors.lightGrey : colors.grey}
                style={styles.inputLabel}
              />
              <TextInput
                style={[
                  styles.textInput,
                  {
                    backgroundColor: isDark ? colors.navyBlue : colors.lightGrey,
                    color: isDark ? colors.white : colors.black
                  }
                ]}
                value={customerInfo.partnerReference}
                onChangeText={(text) => setCustomerInfo(prev => ({ ...prev, partnerReference: text }))}
                placeholder={t("GlobalTix.cart.placeholders.enterPartnerReference")}
                placeholderTextColor={isDark ? colors.lightGrey : colors.grey}
              />
            </View>
          </View>

          <View style={styles.inputRow}>
            <View style={styles.inputContainer}>
              <TypographyText
                title={t("GlobalTix.cart.remarksOptional")}
                size={14}
                textColor={isDark ? colors.lightGrey : colors.grey}
                style={styles.inputLabel}
              />
              <TextInput
                style={[
                  styles.textArea,
                  {
                    backgroundColor: isDark ? colors.navyBlue : colors.lightGrey,
                    color: isDark ? colors.white : colors.black
                  }
                ]}
                value={customerInfo.remarks}
                onChangeText={(text) => setCustomerInfo(prev => ({ ...prev, remarks: text }))}
                placeholder={t("GlobalTix.cart.placeholders.enterRemarks")}
                placeholderTextColor={isDark ? colors.lightGrey : colors.grey}
                multiline
                numberOfLines={3}
              />
            </View>
          </View>
        </View>


        {/* Checkout Button */}
        <View style={styles.checkoutSection}>
          <CommonButton
            label={t("GlobalTix.cart.buttons.checkout")}
            onPress={handleCheckout}
            loading={loading}
            disabled={loading}
            style={styles.checkoutButton}
          />
        </View>
      </ScrollView>

      {/* Questions Modal */}
      <Modal
        visible={isQuestionsModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeQuestionsModal}
      >
        <View style={styles.modalOverlay}>
          <View style={[
            styles.modalContainer,
            { backgroundColor: isDark ? colors.darkBlue : colors.white }
          ]}>
            <View style={styles.modalHeader}>
              <TypographyText
                title={t("GlobalTix.cart.questions")}
                size={18}
                font={BALOO_SEMIBOLD}
                textColor={isDark ? colors.white : colors.darkBlue}
              />
              <TypographyText
                title={currentTicketTypeName}
                size={14}
                textColor={isDark ? colors.lightGrey : colors.grey}
                style={styles.modalSubtitle}
              />
            </View>

            <ScrollView style={styles.modalContent}>
              {currentTicketTypeId && getQuestionsForTicketType(currentTicketTypeId).map((question, index) => (
                <View key={index} style={styles.modalQuestionItem}>
                  <TypographyText
                    title={question.question || question.text || `Question ${index + 1}`}
                    size={14}
                    textColor={isDark ? colors.white : colors.darkBlue}
                    style={styles.modalQuestionText}
                  />

                  {/* Dynamic question type handling */}
                  {renderQuestionInput(question, index)}
                </View>
              ))}
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={closeQuestionsModal}
              >
                <TypographyText
                  title={t("General.cancel")}
                  size={14}
                  textColor={isDark ? colors.white : colors.darkBlue}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={saveQuestionAnswers}
              >
                <TypographyText
                  title={t("GlobalTix.cart.saveAnswers")}
                  size={14}
                  textColor={colors.white}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </MainLayout>
  );
};

// Memoized so an unrelated re-render of GlobalTixCartScreen (typing in a form
// field, opening a modal, etc.) doesn't re-render every cart row — only rows
// whose own props actually changed. Relies on the cart reducer's per-key
// immutable updates keeping untouched `item` object references stable.
const CartItemCard = memo(({
  item,
  cartKey,
  isSelected,
  itemTotal,
  isDark,
  translatedTicketName,
  translatedOptionName,
  hasQuestions,
  t,
  onToggleSelect,
  onQuantityChange,
  onOpenQuestions,
}) => {
  return (
    <View style={styles.cartItem}>
      <View style={styles.cartItemHeader}>
        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={() => onToggleSelect(cartKey)}
        >
          <View style={[
            styles.checkbox,
            { backgroundColor: isSelected ? colors.darkBlue || '#1976D2' : 'transparent' }
          ]}>
            {isSelected && (
              <TypographyText title="✓" size={12} textColor={colors.white} />
            )}
          </View>
        </TouchableOpacity>

        <View style={styles.productImageContainer}>
          <Image
            source={{
              uri: item.product.image ? generateImageUrl(item.product.image) :
                item.product.media?.[0]?.path ? generateImageUrl(item.product.media[0].path) :
                  'https://via.placeholder.com/80x60'
            }}
            style={styles.productImage}
            contentFit="cover"
          />
        </View>

        <View style={styles.productDetails}>
          <TypographyText
            title={translatedTicketName}
            size={16}
            font={BALOO_SEMIBOLD}
            textColor={isDark ? colors.white : colors.darkBlue}
            numberOfLines={2}
          />
          <TypographyText
            title={`${t("GlobalTix.cart.attraction")}: ${translatedOptionName}`}
            size={12}
            textColor={isDark ? colors.lightGrey : colors.grey}
            style={styles.attractionInfo}
          />
          <TypographyText
            title={item.visitDate
              ? `${t("GlobalTix.cart.visitDate", "Visit Date")}: ${item.visitDate}${item.timeSlot ? ` @ ${new Date(item.timeSlot).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : ''}`
              : `${t("GlobalTix.cart.validity")}: ${new Date().toLocaleDateString()} - ${new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString()}`}
            size={12}
            textColor={isDark ? colors.lightGrey : colors.grey}
            style={styles.validityInfo}
          />
        </View>
      </View>

      <View style={styles.cartItemFooter}>
        <View style={styles.quantitySection}>
          <TypographyText
            title={t("GlobalTix.cart.ticket")}
            size={12}
            textColor={isDark ? colors.lightGrey : colors.grey}
          />
          <View style={styles.quantityControls}>
            <TouchableOpacity
              style={styles.quantityBtn}
              onPress={() => onQuantityChange(
                item.productId,
                item.optionId,
                item.ticketTypeId,
                item.quantity - 1
              )}
            >
              <TypographyText title="-" size={16} textColor={colors.white} />
            </TouchableOpacity>

            <TypographyText
              title={item.quantity.toString()}
              size={16}
              font={BALOO_SEMIBOLD}
              textColor={isDark ? colors.white : colors.darkBlue}
              style={styles.quantity}
            />

            <TouchableOpacity
              style={styles.quantityBtn}
              onPress={() => onQuantityChange(
                item.productId,
                item.optionId,
                item.ticketTypeId,
                item.quantity + 1
              )}
            >
              <TypographyText title="+" size={16} textColor={colors.white} />
            </TouchableOpacity>
          </View>
        </View>

        <TypographyText
          title={formatCurrency(itemTotal)}
          size={16}
          font={BALOO_SEMIBOLD}
          textColor={colors.blue || '#2196F3'}
        />
      </View>

      {/* Questions Button */}
      {hasQuestions && (
        <View style={styles.questionsButtonContainer}>
          <TouchableOpacity
            style={[
              styles.questionsButton,
              { backgroundColor: colors.blue || '#2196F3' }
            ]}
            onPress={() => onOpenQuestions(item.ticketTypeId, translatedTicketName)}
          >
            <TypographyText
              title={t("GlobalTix.cart.answerQuestions")}
              size={12}
              textColor={colors.white}
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 30,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: {
    marginBottom: 20,
  },
  emptyTitle: {
    marginBottom: 8,
  },
  emptySubtitle: {
    textAlign: 'center',
  },

  // Cart Summary Card
  summaryCard: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  cartSummary: {
    marginBottom: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  removeButton: {
    backgroundColor: colors.red,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    flex: 0.48,
    alignItems: 'center',
  },
  clearButton: {
    backgroundColor: colors.red,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    flex: 0.48,
    alignItems: 'center',
  },

  // Products Card
  productsCard: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  productsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGrey,
    marginBottom: 16,
  },

  // Cart Item
  cartItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGrey,
  },
  cartItemHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  cartItemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  // Checkbox
  checkboxContainer: {
    marginRight: 12,
    marginTop: 2,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.darkBlue || '#1976D2',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Product Image
  productImageContainer: {
    marginRight: 12,
  },
  productImage: {
    width: 80,
    height: 60,
    borderRadius: 4,
  },

  // Product Details
  productDetails: {
    flex: 1,
  },
  attractionInfo: {
    marginTop: 4,
  },
  validityInfo: {
    marginTop: 2,
  },

  // Quantity Section
  quantitySection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  quantityBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.darkBlue || '#1976D2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantity: {
    marginHorizontal: 12,
    minWidth: 20,
    textAlign: 'center',
  },

  // Payment Card
  paymentCard: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  paymentMethodContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: colors.lightGrey,
    borderRadius: 4,
    marginBottom: 16,
  },
  paymentSummary: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.lightGrey,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  totalRow: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.lightGrey,
  },

  // Form Section
  formSection: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  inputContainer: {
    flex: 1,
  },
  inputLabel: {
    marginBottom: 4,
  },
  textInput: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 4,
    fontSize: 16,
    borderWidth: 1,
    borderColor: colors.lightGrey,
  },
  textArea: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 4,
    fontSize: 16,
    height: 80,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: colors.lightGrey,
  },


  // Checkout Section
  checkoutSection: {
    paddingBottom: 20,
  },
  checkoutButton: {
    // CommonButton will handle its own styling
  },

  // Question button styles
  questionsButtonContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.lightGrey,
  },
  questionsButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    maxHeight: '80%',
    borderRadius: 12,
    padding: 0,
  },
  modalHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGrey,
  },
  modalSubtitle: {
    marginTop: 4,
  },
  modalContent: {
    maxHeight: 400,
    padding: 20,
  },
  modalQuestionItem: {
    marginBottom: 16,
  },
  modalQuestionText: {
    marginBottom: 8,
  },
  modalQuestionInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: colors.lightGrey,
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: colors.lightGrey,
  },
  saveButton: {
    backgroundColor: colors.blue || '#2196F3',
  },

  // Option styles
  optionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  optionButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
});

export default GlobalTixCartScreen;