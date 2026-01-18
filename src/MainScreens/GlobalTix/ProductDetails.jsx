import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  Image,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import MainLayout from '../../components/MainLayout';
import Header from '../../components/Header';
import { TypographyText } from '../../components/Typography';
import { BALOO_SEMIBOLD, BALOO_REGULAR } from '../../redux/types';
import { colors } from '../../components/colors';
import { useTheme } from '../../components/ThemeProvider';
import { useTranslation } from 'react-i18next';
import { globalTixAPI } from '../../redux/globalTix/globalTix-api';
import { addToGlobalTixCartThunk, removeFromGlobalTixCartThunk } from '../../redux/globalTix/globalTix-cart-thunks';
import { getGlobalTixCartItemQuantity } from '../../redux/globalTix/globalTix-cart-selectors';
import GlobalTixCart from '../../components/GlobalTixCart/GlobalTixCart';
import FullScreenLoader from '../../components/Loaders/FullScreenLoader';
import { convertToQAR } from '../../utils/currencyConverter';
import { translateProduct, translateOptions } from '../../utils/translationService';
import { getTicketSellingPrice } from '../../utils/globalTixPricing';
import { GLOBALTIX_CONFIG } from '../../config/globalTix';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "../../styles/mainStyles";
import { sized } from "../../Svg";
import Swiper from "react-native-swiper";
import ImageViewer from "react-native-image-zoom-viewer";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import CloseSvg from "../../assets/close_white.svg";
import CloseXSvg from "../../assets/close.svg";
import SmartImage from "../../components/SmartImage/SmartImage";
import HTMLRenderer from '../../components/HTMLRenderer';

const CloseIcon = sized(CloseSvg, 24);
const CloseXIcon = sized(CloseXSvg, 20);

const CONSTANTS = {
  TICKETS: "TICKETS",
  PACKAGES: "PACKAGES",
  INFO: "INFO",
};

const getTabs = (t) => {
  return [
    { key: CONSTANTS.TICKETS, label: t("GlobalTix.productDetails.tabs.tickets") },
   // { key: CONSTANTS.PACKAGES, label: "Packages / Transportation" },
    { key: CONSTANTS.INFO, label: t("GlobalTix.productDetails.tabs.moreInformation") },
  ];
};

const ProductDetails = ({ route, navigation }) => {
  const { productId } = route.params || {};
  const { isDark } = useTheme();
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  
  // Get cart items from Redux state
  const cartItems = useSelector(state => state.globalTix.cart.cartItems);
  
  
  const [product, setProduct] = useState(null);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(CONSTANTS.TICKETS);
  const [isFullImage, setIsFullImage] = useState(false);
  const [selectedTickets, setSelectedTickets] = useState({});
  const [failedImages, setFailedImages] = useState({});
  const [expandedTickets, setExpandedTickets] = useState({});
  
  // Use ref to track current selectedTickets state
  const selectedTicketsRef = useRef({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [pendingCartAction, setPendingCartAction] = useState(null); // Track pending cart action
  const [availabilityData, setAvailabilityData] = useState(null);
  const [ticketAvailabilityStatus, setTicketAvailabilityStatus] = useState({});
  const [isAddingToCart, setIsAddingToCart] = useState({});
  const [convertedPrices, setConvertedPrices] = useState({});
  
  // Translation state
  const currentLanguage = i18n.language;
  const [translatedProduct, setTranslatedProduct] = useState(null);
  const [translatedOptions, setTranslatedOptions] = useState([]);
  const [isTranslating, setIsTranslating] = useState(false);
  
    const tabs = useMemo(() => getTabs(t), [i18n.language, t]);
  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!productId) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const detailsResponse = await globalTixAPI.fetchProductDetails({ productId });
        if (detailsResponse?.success || detailsResponse?.data) {
          const productData = detailsResponse.data || detailsResponse;
          setProduct(productData);
          
          // Translate product if Arabic is selected
          if (currentLanguage === 'ar') {
            const translated = await translateProduct(productData, currentLanguage);
            setTranslatedProduct(translated);
          } else {
            setTranslatedProduct(productData);
          }
        } else {
          setError('Failed to fetch product details');
        }
        
        const optionsResponse = await globalTixAPI.fetchProductOptions({ productId });
        if (optionsResponse?.success || optionsResponse?.data) {
          const optionsData = optionsResponse.data || optionsResponse || [];
          console.log('Options data:', JSON.stringify(optionsData, null, 2));
          setOptions(optionsData);
          
          // Translate options if Arabic is selected
          if (currentLanguage === 'ar') {
            const translated = await translateOptions(optionsData, currentLanguage);
            setTranslatedOptions(translated);
          } else {
            setTranslatedOptions(optionsData);
          }
        } else {
          console.log('No options data found');
          setOptions([]);
          setTranslatedOptions([]);
        }
        
      } catch (error) {
        setError(error.message || 'Failed to fetch product data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProductDetails();
  }, [productId]);

  // Re-translate when language changes
  useEffect(() => {
    const retranslate = async () => {
      if (product && options && options.length > 0) {
        setIsTranslating(true);
        try {
          if (currentLanguage === 'ar') {
            const translatedProd = await translateProduct(product, currentLanguage);
            const translatedOpts = await translateOptions(options, currentLanguage);
            setTranslatedProduct(translatedProd);
            setTranslatedOptions(translatedOpts);
          } else {
            setTranslatedProduct(product);
            setTranslatedOptions(options);
          }
        } catch (error) {
          console.error('Error re-translating:', error);
          setTranslatedProduct(product);
          setTranslatedOptions(options);
        } finally {
          setIsTranslating(false);
        }
      }
    };
    
    retranslate();
  }, [currentLanguage]);

  // Check availability when options are loaded or date changes
  useEffect(() => {
    if (options && options.length > 0) {
      // Only check availability if a date is selected, otherwise show date picker
      if (selectedDate) {
        checkAllTicketsAvailability();
      }
      convertTicketPrices();
    }
  }, [options, selectedDate]);


  // Convert ticket prices to QAR and calculate selling price with markup
  const convertTicketPrices = async () => {
    if (!options || options.length === 0) return;
    
    const priceMap = {};
    const markupPercentage = GLOBALTIX_CONFIG.DEFAULT_MARKUP_PERCENTAGE;
    
    for (const option of options) {
      if (option.ticketType && option.ticketType.length > 0) {
        // Use the currency from the API response
        const optionCurrency = option.currency;
        console.log(`Converting prices for option ${option.id} with currency: ${optionCurrency}`);
        
        for (const ticket of option.ticketType) {
          const ticketKey = `${option.id}_${ticket.id}`;
          
          // Calculate selling price with markup (based on nettPrice)
          const pricing = getTicketSellingPrice(ticket, markupPercentage);
          
          // Convert selling price to QAR (this is what customers see)
          if (pricing.sellingPrice > 0) {
            try {
              console.log(`Converting selling price: ${pricing.sellingPrice} from ${optionCurrency} to QAR`);
              const convertedSellingPrice = await convertToQAR(pricing.sellingPrice, optionCurrency);
              priceMap[`${ticketKey}_selling`] = convertedSellingPrice;
              console.log(`✅ Converted selling price: ${pricing.sellingPrice} ${optionCurrency} -> ${convertedSellingPrice}`);
            } catch (error) {
              console.error(`❌ Error converting selling price for ticket ${ticketKey}:`, error);
              priceMap[`${ticketKey}_selling`] = `${pricing.sellingPrice}`;
            }
          }
          
          // Convert original merchant price (for reference)
          if (ticket.originalMerchantPrice || ticket.original_price) {
            try {
              const priceValue = ticket.originalMerchantPrice || ticket.original_price;
              console.log(`Converting original price: ${priceValue} from ${optionCurrency} to QAR`);
              const convertedPrice = await convertToQAR(priceValue, optionCurrency);
              priceMap[`${ticketKey}_original`] = convertedPrice;
              console.log(`✅ Converted original price: ${priceValue} ${optionCurrency} -> ${convertedPrice}`);
            } catch (error) {
              console.error(`❌ Error converting original price for ticket ${ticketKey}:`, error);
              priceMap[`${ticketKey}_original`] = `${ticket.originalMerchantPrice || ticket.original_price}`;
            }
          }
          
          // Convert minimum merchant selling price (for MSP validation)
          if (ticket.minimumMerchantSellingPrice || ticket.min_selling_price) {
            try {
              const priceValue = ticket.minimumMerchantSellingPrice || ticket.min_selling_price;
              console.log(`Converting min price: ${priceValue} from ${optionCurrency} to QAR`);
              const convertedPrice = await convertToQAR(priceValue, optionCurrency);
              priceMap[`${ticketKey}_min`] = convertedPrice;
              console.log(`✅ Converted min price: ${priceValue} ${optionCurrency} -> ${convertedPrice}`);
            } catch (error) {
              console.error(`❌ Error converting min price for ticket ${ticketKey}:`, error);
              priceMap[`${ticketKey}_min`] = `${ticket.minimumMerchantSellingPrice || ticket.min_selling_price}`;
            }
          }
          
          // Convert nett price (B2B rate - for internal use, not displayed to customers)
          if (ticket.nettPrice || ticket.net_price) {
            try {
              const priceValue = ticket.nettPrice || ticket.net_price;
              console.log(`Converting nett price: ${priceValue} from ${optionCurrency} to QAR`);
              const convertedPrice = await convertToQAR(priceValue, optionCurrency);
              priceMap[`${ticketKey}_nett`] = convertedPrice;
              console.log(`✅ Converted nett price: ${priceValue} ${optionCurrency} -> ${convertedPrice}`);
            } catch (error) {
              console.error(`❌ Error converting nett price for ticket ${ticketKey}:`, error);
              priceMap[`${ticketKey}_nett`] = `${ticket.nettPrice || ticket.net_price}`;
            }
          }
          
          // Convert agent rate
          if (ticket.agentRate || ticket.agent_rate) {
            try {
              const priceValue = ticket.agentRate || ticket.agent_rate;
              console.log(`Converting agent rate: ${priceValue} from ${optionCurrency} to QAR`);
              const convertedPrice = await convertToQAR(priceValue, optionCurrency);
              priceMap[`${ticketKey}_agent`] = convertedPrice;
              console.log(`✅ Converted agent rate: ${priceValue} ${optionCurrency} -> ${convertedPrice}`);
            } catch (error) {
              console.error(`❌ Error converting agent rate for ticket ${ticketKey}:`, error);
              priceMap[`${ticketKey}_agent`] = `${ticket.agentRate || ticket.agent_rate}`;
            }
          }
        }
      }
    }
    
    console.log('Final converted prices map:', priceMap);
    setConvertedPrices(priceMap);
  };

  const getCartQuantity = (optionId, ticketTypeId) => {
    if (!product) return 0;
    const cartKey = `${product.id}_${optionId}_${ticketTypeId}`;
    return cartItems[cartKey]?.quantity || 0;
  };

  const handleQuantityChange = async (optionId, ticketTypeId, change) => {
    if (!product) return;
    
    const option = options.find(opt => opt.id === optionId);
    const ticketType = option?.ticketType?.find(ticket => ticket.id === ticketTypeId);
    
    if (!option || !ticketType) return;
    
    const currentQuantity = getCartQuantity(optionId, ticketTypeId);
    const newQuantity = Math.max(0, currentQuantity + change);
    
    if (newQuantity === 0) {
      // Remove from cart if quantity becomes 0
      dispatch(removeFromGlobalTixCartThunk({
        productId: product.id,
        optionId: option.id,
        ticketTypeId: ticketType.id,
      }));
      return;
    }

    // If increasing quantity, always show date picker first
    if (change > 0) {
      console.log('=== QUANTITY CHANGE DEBUG ===');
      console.log('selectedDate:', selectedDate);
      console.log('change:', change);
      console.log('optionId:', optionId, 'ticketTypeId:', ticketTypeId);
      
      // Always show date picker to let user select date
      console.log('Opening date picker for quantity change');
      setPendingCartAction({ type: 'quantityChange', optionId, ticketTypeId, change });
      setIsDatePickerVisible(true);
      return;
    }
    
    // Calculate selling price with markup and convert to QAR before updating cart
    let convertedPrice = 0;
    try {
      const optionCurrency = option.currency;
      const markupPercentage = GLOBALTIX_CONFIG.DEFAULT_MARKUP_PERCENTAGE;
      
      // Calculate selling price with markup (this is what customers pay)
      const pricing = getTicketSellingPrice(ticketType, markupPercentage);
      const sellingPrice = pricing.sellingPrice;
      
      if (sellingPrice > 0) {
        const convertedPriceString = await convertToQAR(sellingPrice, optionCurrency, false);
        convertedPrice = parseFloat(convertedPriceString.replace(/[^\d.]/g, ''));
        console.log(`Converted selling price for quantity update: ${sellingPrice} ${optionCurrency} -> ${convertedPrice} QAR`);
      }
    } catch (error) {
      console.error('Error converting price for quantity update:', error);
      // Fallback: calculate selling price without conversion
      const markupPercentage = GLOBALTIX_CONFIG.DEFAULT_MARKUP_PERCENTAGE;
      const pricing = getTicketSellingPrice(ticketType, markupPercentage);
      convertedPrice = pricing.sellingPrice || 0;
    }

    const cartPayload = {
      productId: product.id,
      optionId: option.id,
      ticketTypeId: ticketType.id,
      product: product,
      option: option,
      ticketType: ticketType,
      quantity: newQuantity,
      convertedPrice: convertedPrice, // Add converted price for quantity updates
      visitDate: selectedDate ? selectedDate.toISOString().split('T')[0] : null, // Add visiting date
    };
    dispatch(addToGlobalTixCartThunk(cartPayload));
  };

  const handleAddToCart = async (optionId, ticketTypeId) => {
    if (!product) {
      return;
    }
    
    const option = options.find(opt => opt.id === optionId);
    const ticketType = option?.ticketType?.find(ticket => ticket.id === ticketTypeId);
    
    if (!option || !ticketType) {
      return;
    }

    // Always show date picker first to let user select date
    setPendingCartAction({ type: 'addToCart', optionId, ticketTypeId });
    setIsDatePickerVisible(true);
  };

  const proceedWithAddToCart = async (optionId, ticketTypeId, option, ticketType, confirmedDate = null) => {
    // Calculate selling price with markup and convert to QAR before adding to cart
    let convertedPrice = 0;
    try {
      const optionCurrency = option.currency;
      const markupPercentage = GLOBALTIX_CONFIG.DEFAULT_MARKUP_PERCENTAGE;
      
      // Calculate selling price with markup (this is what customers pay)
      const pricing = getTicketSellingPrice(ticketType, markupPercentage);
      const sellingPrice = pricing.sellingPrice;
      
      if (sellingPrice > 0) {
        const convertedPriceString = await convertToQAR(sellingPrice, optionCurrency, false);
        // Extract numeric value from converted price (remove "QR " prefix)
        convertedPrice = parseFloat(convertedPriceString.replace(/[^\d.]/g, ''));
        console.log(`Converted selling price for cart: ${sellingPrice} ${optionCurrency} -> ${convertedPrice} QAR`);
        console.log(`Pricing breakdown: nettPrice=${pricing.nettPrice}, markup=${pricing.markupPercentage}%, sellingPrice=${pricing.sellingPrice}, MSP=${pricing.mspPrice || 'N/A'}`);
      }
    } catch (error) {
      console.error('Error converting price for cart:', error);
      // Fallback: calculate selling price without conversion
      const markupPercentage = GLOBALTIX_CONFIG.DEFAULT_MARKUP_PERCENTAGE;
      const pricing = getTicketSellingPrice(ticketType, markupPercentage);
      convertedPrice = pricing.sellingPrice || 0;
    }

    // Use the confirmed date if provided, otherwise fall back to selectedDate
    const dateToUse = confirmedDate || selectedDate;
    
    const cartPayload = {
      productId: product.id,
      optionId: option.id,
      ticketTypeId: ticketType.id,
      product: product,
      option: option,
      ticketType: ticketType,
      quantity: 1,
      convertedPrice: convertedPrice, // Add converted price to payload
      visitDate: dateToUse ? dateToUse.toISOString().split('T')[0] : null, // Add visiting date
    };
    
    console.log('=== Adding to Cart Debug ===');
    console.log('Selected date:', selectedDate);
    console.log('Visit date string:', selectedDate ? selectedDate.toISOString().split('T')[0] : null);
    console.log('Dispatching addToGlobalTixCartThunk with payload:', cartPayload);
    
    dispatch(addToGlobalTixCartThunk(cartPayload));
    
    setSelectedTickets(prev => ({
      ...prev,
      [optionId]: ticketTypeId
    }));
    
    console.log('Ticket added to cart successfully');
    Alert.alert(t("GlobalTix.productDetails.alerts.success"), t("GlobalTix.productDetails.alerts.ticketAddedToCart"), [{ text: t("GlobalTix.productDetails.buttons.ok") }]);
  };

  const handleSelectTicket = (optionId, ticketTypeId) => {
    console.log('Toggling ticket selection - optionId:', optionId, 'ticketTypeId:', ticketTypeId);
    
    setSelectedTickets(prev => {
      const isCurrentlySelected = prev[optionId] === ticketTypeId;
      
      let newState;
      if (isCurrentlySelected) {
        // Unselect: remove this ticket from selection
        const { [optionId]: removed, ...rest } = prev;
        newState = rest;
        console.log('Unselected ticket - new state:', newState);
      } else {
        // Select: add this ticket to selection
        newState = {
        ...prev,
        [optionId]: ticketTypeId
      };
        console.log('Selected ticket - new state:', newState);
      }
      
      // Update ref to track current state
      selectedTicketsRef.current = newState;
      return newState;
    });
    
  };

  const handleCheckAvailability = () => {
    console.log('handleCheckAvailability called - selectedTickets:', selectedTickets);
    console.log('handleCheckAvailability - selectedTickets keys:', Object.keys(selectedTickets));
    console.log('handleCheckAvailability - keys length:', Object.keys(selectedTickets).length);
    console.log('handleCheckAvailability - selectedTicketsRef.current:', selectedTicketsRef.current);
    
    // Use ref to get the current state (always up-to-date)
    const currentSelectedTickets = selectedTicketsRef.current;
    const selectedTicketEntries = Object.entries(currentSelectedTickets);
    
    console.log('Current selectedTickets from ref:', currentSelectedTickets);
    console.log('Selected ticket entries from ref:', selectedTicketEntries);
    
    if (selectedTicketEntries.length === 0) {
      Alert.alert(
        t("GlobalTix.productDetails.alerts.noTicketsSelected"), 
        t("GlobalTix.productDetails.alerts.noTicketsSelectedMessage"),
        [{ text: t("GlobalTix.productDetails.buttons.ok") }]
      );
      return;
    }
    
    // If tickets are selected, open date picker
    setIsDatePickerVisible(true);
  };

  const handleDateConfirm = async (date) => {
    console.log('=== DATE CONFIRMED ===');
    console.log('Selected date:', date);
    console.log('Date string:', date.toISOString().split('T')[0]);
    setSelectedDate(date);
    setIsDatePickerVisible(false);
    setIsCheckingAvailability(true);
    
    try {
      // If there's a pending cart action, check availability and execute it
      console.log('=== PENDING CART ACTION DEBUG ===');
      console.log('pendingCartAction:', pendingCartAction);
      
      if (pendingCartAction) {
        console.log('Executing pending cart action:', pendingCartAction.type);
        const optionId = pendingCartAction.optionId;
        const ticketTypeId = pendingCartAction.ticketTypeId;
        
        // Check availability using the correct API endpoint
        const dateFrom = date.toISOString().split('T')[0];
        const futureDate = new Date(date);
        futureDate.setDate(futureDate.getDate() + 30);
        const dateTo = futureDate.toISOString().split('T')[0];
        
        console.log(`🎫 Checking availability for pending cart action - ticket ID: ${ticketTypeId}, date: ${dateFrom}`);
        
        const availabilityResponse = await globalTixAPI.checkEventAvailability({
          ticketTypeID: ticketTypeId,
          dateFrom: dateFrom,
          dateTo: dateTo
        });
        
        if (availabilityResponse.success && availabilityResponse.data) {
          // Check if the selected date has available slots
          const selectedDateSlots = availabilityResponse.data.filter(slot => {
            const slotDate = slot.time ? slot.time.split('T')[0] : null;
            return slotDate === dateFrom && slot.available > 0;
          });
          
          if (selectedDateSlots.length === 0) {
            // Find next available date
            const availableSlots = availabilityResponse.data.filter(slot => slot.available > 0);
            const nextAvailableDate = availableSlots.length > 0 
              ? new Date(availableSlots[0].time).toLocaleDateString() 
              : 'Not found';
            
            Alert.alert(
              t("GlobalTix.productDetails.alerts.ticketUnavailable"),
              `No tickets available on ${date.toLocaleDateString()}.\n${availableSlots.length > 0 ? `Next available: ${nextAvailableDate}` : 'No available dates in the next 30 days.'}`,
              [
                { 
                  text: t("GlobalTix.productDetails.buttons.pickDifferentDate"), 
                  onPress: () => {
                    setSelectedDate(null);
                    setIsDatePickerVisible(true);
                  }
                },
                { text: t("GlobalTix.productDetails.buttons.ok") }
              ]
            );
            // Reset selectedDate so user can pick a different date next time
            setSelectedDate(null);
            setPendingCartAction(null);
            setIsCheckingAvailability(false);
            return;
          }
          
          console.log(`🎫 ✅ Ticket ${ticketTypeId} is available on ${dateFrom} - ${selectedDateSlots.length} slots with ${selectedDateSlots.reduce((sum, slot) => sum + slot.available, 0)} total tickets`);
          
          // Execute the cart action with the confirmed date only if available
          if (pendingCartAction.type === 'quantityChange') {
            await executeQuantityChange(optionId, ticketTypeId, pendingCartAction.change, date);
          } else if (pendingCartAction.type === 'addToCart') {
            await executeAddToCart(optionId, ticketTypeId, date);
          }
        } else {
          // Handle error case - no availability or API error
          const errorMessage = availabilityResponse.error 
            ? (typeof availabilityResponse.error === 'object' 
                ? availabilityResponse.error.message || availabilityResponse.error.code || 'No available events'
                : availabilityResponse.error)
            : 'No available events';
          
          console.warn('🎫 ⚠️ Could not verify availability:', availabilityResponse.error);
          
          Alert.alert(
            t("GlobalTix.productDetails.alerts.ticketUnavailable"),
            errorMessage,
            [
              { 
                text: t("GlobalTix.productDetails.buttons.pickDifferentDate"), 
                onPress: () => {
                  setSelectedDate(null);
                  setIsDatePickerVisible(true);
                }
              },
              { text: t("GlobalTix.productDetails.buttons.ok") }
            ]
          );
          // Don't execute cart action if there's no availability
          setSelectedDate(null);
          setPendingCartAction(null);
          setIsCheckingAvailability(false);
          return;
        }
        
        setPendingCartAction(null);
        setIsCheckingAvailability(false);
        return;
      }
      
      // Check if we have any selected tickets to check availability for
      const selectedTicketEntries = Object.entries(selectedTickets);
      
      if (selectedTicketEntries.length === 0) {
        Alert.alert(
          t("GlobalTix.productDetails.alerts.noTicketsSelected"), 
          t("GlobalTix.productDetails.alerts.noTicketsSelectedMessage"),
          [{ text: t("GlobalTix.productDetails.buttons.ok") }]
        );
        setIsCheckingAvailability(false);
        return;
      }
      
      // Check availability for all selected tickets using the correct API
      const dateFrom = date.toISOString().split('T')[0];
      const futureDate = new Date(date);
      futureDate.setDate(futureDate.getDate() + 30);
      const dateTo = futureDate.toISOString().split('T')[0];
      
      console.log(`🎫 Checking availability for ${selectedTicketEntries.length} selected tickets from ${dateFrom} to ${dateTo}`);
      
      const newAvailabilityStatus = {};
      let availableCount = 0;
      let unavailableCount = 0;
      
      // Check each selected ticket individually
      for (const [optionId, ticketTypeId] of selectedTicketEntries) {
        try {
          console.log(`🎫 Checking selected ticket - optionId: ${optionId}, ticketTypeId: ${ticketTypeId}`);
          
          const availabilityResponse = await globalTixAPI.checkEventAvailability({
            ticketTypeID: ticketTypeId,
            dateFrom: dateFrom,
            dateTo: dateTo
          });
          
          const cartKey = `${optionId}_${ticketTypeId}`;
          
          if (availabilityResponse.success && availabilityResponse.data) {
            // Check if the selected date has available slots
            const selectedDateSlots = availabilityResponse.data.filter(slot => {
              const slotDate = slot.time ? slot.time.split('T')[0] : null;
              return slotDate === dateFrom && slot.available > 0;
            });
            
            const isAvailable = selectedDateSlots.length > 0;
            
            if (isAvailable) {
              availableCount++;
            } else {
              unavailableCount++;
            }
            
            const totalAvailable = selectedDateSlots.reduce((sum, slot) => sum + slot.available, 0);
            
            newAvailabilityStatus[cartKey] = {
              status: isAvailable ? 'available' : 'not_available',
              hasAvailability: isAvailable,
              selectedDateSlots: selectedDateSlots,
              lastChecked: new Date(),
              message: isAvailable 
                ? `${totalAvailable} tickets available on ${dateFrom}` 
                : `No tickets available on ${dateFrom}`,
              meta: availabilityResponse.meta
            };
            
            console.log(`🎫 Ticket ${ticketTypeId}: ${isAvailable ? '✅ Available' : '❌ Not Available'}`);
          } else {
            unavailableCount++;
            const errorMessage = availabilityResponse.error 
              ? (typeof availabilityResponse.error === 'object' 
                  ? availabilityResponse.error.message || availabilityResponse.error.code || 'Unable to check availability'
                  : availabilityResponse.error)
              : 'Unable to check availability';
            
            newAvailabilityStatus[cartKey] = {
              status: 'error',
              hasAvailability: false,
              lastChecked: new Date(),
              message: errorMessage,
              error: availabilityResponse.error
            };
          }
        } catch (error) {
          console.error(`🎫 Error checking ticket ${ticketTypeId}:`, error);
          unavailableCount++;
          const cartKey = `${optionId}_${ticketTypeId}`;
          newAvailabilityStatus[cartKey] = {
            status: 'error',
            hasAvailability: false,
            lastChecked: new Date(),
            message: error.message || 'Error checking availability',
            error: error.message
          };
        }
      }
      
      setTicketAvailabilityStatus(prev => ({ ...prev, ...newAvailabilityStatus }));
      
      // Show summary alert
      let message = `Availability check complete for ${date.toLocaleDateString()}:\n\n`;
      
      if (availableCount > 0) {
        message += `✅ ${availableCount} ticket(s) available\n`;
      }
      
      if (unavailableCount > 0) {
        message += `❌ ${unavailableCount} ticket(s) not available\n`;
      }
      
      Alert.alert(
        t("GlobalTix.productDetails.alerts.availabilityCheckComplete"), 
        message,
        [{ text: t("GlobalTix.productDetails.buttons.ok") }]
      );
    } catch (error) {
      console.error('Error checking availability:', error);
      Alert.alert(
        t("GlobalTix.productDetails.alerts.error"), 
        t("General.error"),
        [{ text: t("GlobalTix.productDetails.buttons.ok") }]
      );
    } finally {
      setIsCheckingAvailability(false);
    }
  };

  const handleDateCancel = () => {
    setIsDatePickerVisible(false);
    setPendingCartAction(null); // Clear pending action on cancel
  };

  // Helper function to execute quantity change
  const executeQuantityChange = async (optionId, ticketTypeId, change, confirmedDate = null) => {
    const option = options.find(opt => opt.id === optionId);
    const ticketType = option?.ticketType?.find(ticket => ticket.id === ticketTypeId);
    
    if (!option || !ticketType) return;
    
    const currentQuantity = getCartQuantity(optionId, ticketTypeId);
    const newQuantity = Math.max(0, currentQuantity + change);
    
    if (newQuantity === 0) {
      // Remove from cart if quantity becomes 0
      dispatch(removeFromGlobalTixCartThunk({
        productId: product.id,
        optionId: option.id,
        ticketTypeId: ticketType.id,
      }));
      return;
    }

    // Calculate selling price with markup and convert to QAR before updating cart
    let convertedPrice = 0;
    try {
      const optionCurrency = option.currency;
      const markupPercentage = GLOBALTIX_CONFIG.DEFAULT_MARKUP_PERCENTAGE;
      
      // Calculate selling price with markup (this is what customers pay)
      const pricing = getTicketSellingPrice(ticketType, markupPercentage);
      const sellingPrice = pricing.sellingPrice;
      
      if (sellingPrice > 0) {
        const convertedPriceString = await convertToQAR(sellingPrice, optionCurrency, false);
        convertedPrice = parseFloat(convertedPriceString.replace(/[^\d.]/g, ''));
        console.log(`Converted selling price for quantity update: ${sellingPrice} ${optionCurrency} -> ${convertedPrice} QAR`);
      }
    } catch (error) {
      console.error('Error converting price for quantity update:', error);
      // Fallback: calculate selling price without conversion
      const markupPercentage = GLOBALTIX_CONFIG.DEFAULT_MARKUP_PERCENTAGE;
      const pricing = getTicketSellingPrice(ticketType, markupPercentage);
      convertedPrice = pricing.sellingPrice || 0;
    }

    // Use the confirmed date if provided, otherwise fall back to selectedDate
    const dateToUse = confirmedDate || selectedDate;
    
    dispatch(addToGlobalTixCartThunk({
      productId: product.id,
      optionId: option.id,
      ticketTypeId: ticketType.id,
      product: product,
      option: option,
      ticketType: ticketType,
      quantity: newQuantity,
      convertedPrice: convertedPrice,
      visitDate: dateToUse ? dateToUse.toISOString().split('T')[0] : null,
    }));
  };

  // Helper function to execute add to cart
  const executeAddToCart = async (optionId, ticketTypeId, confirmedDate = null) => {
    const option = options.find(opt => opt.id === optionId);
    const ticketType = option?.ticketType?.find(ticket => ticket.id === ticketTypeId);
    
    if (!option || !ticketType) return;

    const cartKey = `${optionId}_${ticketTypeId}`;
    setIsAddingToCart(prev => ({ ...prev, [cartKey]: true }));
    
    try {
      // Check availability before adding to cart using the correct API
      const dateToCheck = confirmedDate || selectedDate;
      if (!dateToCheck) {
        Alert.alert(
          t("GlobalTix.productDetails.alerts.error"),
          "Please select a visit date first",
          [{ text: t("GlobalTix.productDetails.buttons.ok") }]
        );
        return;
      }
      
      const dateFrom = dateToCheck.toISOString().split('T')[0];
      const futureDate = new Date(dateToCheck);
      futureDate.setDate(futureDate.getDate() + 30);
      const dateTo = futureDate.toISOString().split('T')[0];
      
      console.log(`🎫 Checking availability before adding to cart - ticket ID: ${ticketTypeId}, date: ${dateFrom}`);
      
      const availabilityResponse = await globalTixAPI.checkEventAvailability({
        ticketTypeID: ticketTypeId,
        dateFrom: dateFrom,
        dateTo: dateTo
      });
      
      if (availabilityResponse.success && availabilityResponse.data) {
        // Check if the selected date has available slots
        const selectedDateSlots = availabilityResponse.data.filter(slot => {
          const slotDate = slot.time ? slot.time.split('T')[0] : null;
          return slotDate === dateFrom && slot.available > 0;
        });
        
        if (selectedDateSlots.length === 0) {
          // Find next available date
          const availableSlots = availabilityResponse.data.filter(slot => slot.available > 0);
          const nextAvailableDate = availableSlots.length > 0 
            ? new Date(availableSlots[0].time).toLocaleDateString() 
            : 'Not found';
          
          Alert.alert(
            t("GlobalTix.productDetails.alerts.ticketUnavailable"), 
            `This ticket is not available on ${dateToCheck.toLocaleDateString()}.\n${availableSlots.length > 0 ? `Next available: ${nextAvailableDate}` : 'No available dates in the next 30 days.'}`,
            [
              { text: t("GlobalTix.productDetails.buttons.checkAvailability"), onPress: () => handleCheckAvailability() },
              { text: t("GlobalTix.productDetails.buttons.ok") }
            ]
          );
          // Reset selectedDate so user can pick a different date next time
          setSelectedDate(null);
          return;
        }
        
        console.log(`🎫 ✅ Ticket is available, proceeding to add to cart`);
        // Proceed with adding to cart only if available
        await proceedWithAddToCart(optionId, ticketTypeId, option, ticketType, confirmedDate);
      } else {
        // Handle error case - no availability or API error
        const errorMessage = availabilityResponse.error 
          ? (typeof availabilityResponse.error === 'object' 
              ? availabilityResponse.error.message || availabilityResponse.error.code || 'No available events'
              : availabilityResponse.error)
          : 'No available events';
        
        console.warn('🎫 ⚠️ Could not verify availability:', availabilityResponse.error);
        
        Alert.alert(
          t("GlobalTix.productDetails.alerts.ticketUnavailable"),
          errorMessage,
          [
            { text: t("GlobalTix.productDetails.buttons.checkAvailability"), onPress: () => handleCheckAvailability() },
            { text: t("GlobalTix.productDetails.buttons.ok") }
          ]
        );
        // Don't add to cart if there's no availability
        return;
      }
      
    } catch (error) {
      console.error('🎫 Error checking availability:', error);
      
      Alert.alert(
        t("GlobalTix.productDetails.alerts.availabilityCheckError"), 
        t("GlobalTix.productDetails.alerts.availabilityCheckErrorMessage"),
        [
          { text: t("GlobalTix.productDetails.buttons.addAnyway"), onPress: () => proceedWithAddToCart(optionId, ticketTypeId, option, ticketType, confirmedDate) },
          { text: t("GlobalTix.productDetails.buttons.cancel") }
        ]
      );
    } finally {
      setIsAddingToCart(prev => ({ ...prev, [cartKey]: false }));
    }
  };

  const handleClearAll = () => {
    setSelectedTickets({});
    setSelectedDate(null);
    setAvailabilityData(null);
    setTicketAvailabilityStatus({});
    Alert.alert(t("GlobalTix.productDetails.alerts.cleared"), t("GlobalTix.productDetails.alerts.clearedMessage"), [{ text: t("GlobalTix.productDetails.buttons.ok") }]);
  };

  // Function to update cart items with new date
  const updateCartItemsWithNewDate = async (newDate) => {
    try {
      const newDateString = newDate.toISOString().split('T')[0];
      
      // First, check availability for all cart items with the new date
      console.log('Checking availability for cart items with new date:', newDateString);
      
      const cartItemEntries = Object.entries(cartItems);
      const optionIds = cartItemEntries.map(([cartKey, item]) => item.optionId);
      
      if (optionIds.length > 0) {
        const availabilityResponse = await globalTixAPI.checkCalendarAvailability({
          optionIds: optionIds,
          date: newDateString,
          pullAll: true
        });
        
        if (availabilityResponse.success && availabilityResponse.data) {
          const availabilityResults = availabilityResponse.data;
          const unavailableItems = availabilityResults.filter(item => item.status !== 'available');
          
          if (unavailableItems.length > 0) {
            // Some items are not available for the new date
            const unavailableItemNames = unavailableItems.map(item => {
              const cartItem = cartItemEntries.find(([key, cartItem]) => cartItem.optionId === item.optionId);
              return cartItem ? cartItem[1].ticketType.name : 'Unknown item';
            }).join(', ');
            
            Alert.alert(
              t("GlobalTix.productDetails.alerts.someItemsUnavailable"),
              t("GlobalTix.productDetails.alerts.someItemsUnavailableMessage", { 
                items: unavailableItemNames,
                date: newDate.toLocaleDateString()
              }),
              [
                { 
                  text: t("GlobalTix.productDetails.buttons.updateAvailableOnly"), 
                  onPress: () => updateOnlyAvailableItems(newDate, availabilityResults)
                },
                { 
                  text: t("GlobalTix.productDetails.buttons.cancel"), 
                  onPress: () => {
                    setSelectedDate(selectedDate); // Revert to previous date
                    setIsCheckingAvailability(false);
                  }
                }
              ]
            );
            return;
          }
        }
      }
      
      // All items are available, proceed with update
      await updateAllCartItemsWithNewDate(newDateString);
      
    } catch (error) {
      console.error('Error checking availability for new date:', error);
      Alert.alert(
        t("GlobalTix.productDetails.alerts.error"),
        t("GlobalTix.productDetails.alerts.availabilityCheckError"),
        [{ text: t("GlobalTix.productDetails.buttons.ok") }]
      );
    } finally {
      setIsCheckingAvailability(false);
    }
  };

  // Helper function to update all cart items with new date
  const updateAllCartItemsWithNewDate = async (newDateString) => {
    try {
      // Update each cart item with the new date
      for (const [cartKey, item] of Object.entries(cartItems)) {
        dispatch(addToGlobalTixCartThunk({
          productId: item.productId,
          optionId: item.optionId,
          ticketTypeId: item.ticketTypeId,
          product: item.product,
          option: item.option,
          ticketType: item.ticketType,
          quantity: item.quantity,
          convertedPrice: item.price,
          visitDate: newDateString,
        }));
      }
      
      Alert.alert(
        t("GlobalTix.productDetails.alerts.cartUpdated"),
        t("GlobalTix.productDetails.alerts.cartUpdatedMessage"),
        [{ text: t("GlobalTix.productDetails.buttons.ok") }]
      );
      
    } catch (error) {
      console.error('Error updating cart items with new date:', error);
      Alert.alert(
        t("GlobalTix.productDetails.alerts.error"),
        t("GlobalTix.productDetails.alerts.cartUpdateError"),
        [{ text: t("GlobalTix.productDetails.buttons.ok") }]
      );
    }
  };

  // Helper function to update only available items
  const updateOnlyAvailableItems = async (newDate, availabilityResults) => {
    try {
      const newDateString = newDate.toISOString().split('T')[0];
      const availableOptionIds = availabilityResults
        .filter(item => item.status === 'available')
        .map(item => item.optionId);
      
      let updatedCount = 0;
      let removedCount = 0;
      
      for (const [cartKey, item] of Object.entries(cartItems)) {
        if (availableOptionIds.includes(item.optionId)) {
          // Update with new date
          dispatch(addToGlobalTixCartThunk({
            productId: item.productId,
            optionId: item.optionId,
            ticketTypeId: item.ticketTypeId,
            product: item.product,
            option: item.option,
            ticketType: item.ticketType,
            quantity: item.quantity,
            convertedPrice: item.price,
            visitDate: newDateString,
          }));
          updatedCount++;
        } else {
          // Remove unavailable items
          dispatch(removeFromGlobalTixCartThunk({
            productId: item.productId,
            optionId: item.optionId,
            ticketTypeId: item.ticketTypeId,
          }));
          removedCount++;
        }
      }
      
      Alert.alert(
        t("GlobalTix.productDetails.alerts.partialUpdate"),
        t("GlobalTix.productDetails.alerts.partialUpdateMessage", { 
          updated: updatedCount,
          removed: removedCount,
          date: newDate.toLocaleDateString()
        }),
        [{ text: t("GlobalTix.productDetails.buttons.ok") }]
      );
      
    } catch (error) {
      console.error('Error updating available items:', error);
      Alert.alert(
        t("GlobalTix.productDetails.alerts.error"),
        t("GlobalTix.productDetails.alerts.cartUpdateError"),
        [{ text: t("GlobalTix.productDetails.buttons.ok") }]
      );
    }
  };

  // Function to check availability for all tickets using the correct API
  const checkAllTicketsAvailability = async () => {
    if (!options || options.length === 0) return;
    
    try {
      // Calculate date range: from selected date to 30 days in the future
      // (API returns results up to 30 days from the 'From' date as per documentation)
      const dateToCheck = selectedDate ? new Date(selectedDate) : new Date();
      const dateFrom = dateToCheck.toISOString().split('T')[0];
      
      // Add 30 days for dateTo (API limitation as per documentation)
      const futureDate = new Date(dateToCheck);
      futureDate.setDate(futureDate.getDate() + 30);
      const dateTo = futureDate.toISOString().split('T')[0];
      
      console.log(`🎫 Checking availability for all tickets from ${dateFrom} to ${dateTo}`);
      
      const newAvailabilityStatus = {};
      
      // Check availability for each individual ticket type as per documentation
      for (const option of options) {
        if (option.ticketType && Array.isArray(option.ticketType)) {
          for (const ticket of option.ticketType) {
            try {
              console.log(`🎫 Checking availability for ticket ID: ${ticket.id} (${ticket.name})`);
              
              // Call the correct API endpoint for each ticket
              const availabilityResponse = await globalTixAPI.checkEventAvailability({
                ticketTypeID: ticket.id,
                dateFrom: dateFrom,
                dateTo: dateTo
              });
              
              const cartKey = `${option.id}_${ticket.id}`;
              
              if (availabilityResponse.success && availabilityResponse.data) {
                // Check if there are any available slots in the response
                const availableSlots = availabilityResponse.data.filter(slot => slot.available > 0);
                const hasAvailability = availableSlots.length > 0;
                const totalAvailableTickets = availableSlots.reduce((sum, slot) => sum + slot.available, 0);
                
                // Find slots for the exact selected date
                const selectedDateSlots = availabilityResponse.data.filter(slot => {
                  const slotDate = slot.time ? slot.time.split('T')[0] : null;
                  return slotDate === dateFrom;
                });
                const selectedDateAvailable = selectedDateSlots.some(slot => slot.available > 0);
                
                newAvailabilityStatus[cartKey] = {
                  status: selectedDateAvailable ? 'available' : 'not_available',
                  hasAvailability: hasAvailability,
                  totalAvailableTickets: totalAvailableTickets,
                  availableSlots: availableSlots,
                  selectedDateSlots: selectedDateSlots,
                  allSlots: availabilityResponse.data,
                  lastChecked: new Date(),
                  message: selectedDateAvailable 
                    ? `${selectedDateSlots.reduce((sum, slot) => sum + slot.available, 0)} tickets available on ${dateFrom}` 
                    : `No tickets available on ${dateFrom}`,
                  meta: availabilityResponse.meta
                };
                
                console.log(`🎫 Ticket ${ticket.id}: ${selectedDateAvailable ? '✅ Available' : '❌ Not Available'} on ${dateFrom}`);
              } else {
                // Handle error case
                const errorMessage = availabilityResponse.error 
                  ? (typeof availabilityResponse.error === 'object' 
                      ? availabilityResponse.error.message || availabilityResponse.error.code || 'Unable to check availability'
                      : availabilityResponse.error)
                  : 'Unable to check availability';
                
                newAvailabilityStatus[cartKey] = {
                  status: 'error',
                  hasAvailability: false,
                  lastChecked: new Date(),
                  message: errorMessage,
                  error: availabilityResponse.error
                };
                console.error(`🎫 Error checking ticket ${ticket.id}:`, availabilityResponse.error);
              }
            } catch (error) {
              console.error(`🎫 Exception checking ticket ${ticket.id}:`, error);
              const cartKey = `${option.id}_${ticket.id}`;
              newAvailabilityStatus[cartKey] = {
                status: 'error',
                hasAvailability: false,
                lastChecked: new Date(),
                message: error.message || 'Error checking availability',
                error: error.message
              };
            }
          }
        }
      }
      
      setTicketAvailabilityStatus(newAvailabilityStatus);
      console.log('🎫 Availability check complete for all tickets');
    } catch (error) {
      console.error('🎫 Error checking availability for all tickets:', error);
    }
  };

  const handleToggleExpanded = (ticketId) => {
    setExpandedTickets(prev => ({
      ...prev,
      [ticketId]: !prev[ticketId]
    }));
  };


  const renderHeader = useCallback(() => {
    // Use translated product if available, otherwise fallback to original
    const displayProduct = translatedProduct || product;
    if (!displayProduct) return null;
    if (!product) return null;

    const generateImageUrl = (path, isFallback = false) => {
      if (!path) return null;
      
      // Try multiple CDN environments for better reliability
      const environments = ['live-gtImage', 'stg-gtImage', 'prod-gtImage', 'uat-gtImage'];
      const baseUrl = 'https://product-image.globaltix.com';
      
      if (isFallback) {
        // For fallback, try staging environment
        return `${baseUrl}/stg-gtImage/${path}`;
      }
      
      // For primary, try live environment first
      return `${baseUrl}/live-gtImage/${path}`;
    };
    
    
    // Test image URL generation
    if (product.media?.length) {
      product.media.forEach((media, index) => {
        const primaryUrl = generateImageUrl(media.path);
        const fallbackUrl = generateImageUrl(media.path, true);
        console.log(`Media ${index} - Primary URL:`, primaryUrl);
        console.log(`Media ${index} - Fallback URL:`, fallbackUrl);
      });
    }
    
    if (product.image) {
      const primaryUrl = generateImageUrl(product.image);
      const fallbackUrl = generateImageUrl(product.image, true);
      console.log('Product image - Primary URL:', primaryUrl);
      console.log('Product image - Fallback URL:', fallbackUrl);
    }
    
    // Test network connectivity for image URLs
    const testImageUrl = async (url) => {
      try {
        const response = await fetch(url, { method: 'HEAD' });
        console.log(`Image URL test: ${url} - Status: ${response.status}`);
        return response.ok;
      } catch (error) {
        console.log(`Image URL test failed: ${url} - Error:`, error.message);
        return false;
      }
    };
    
    // Test a few image URLs if they exist
    if (product.media?.length > 0) {
      const testUrl = generateImageUrl(product.media[0].path);
      if (testUrl) {
        testImageUrl(testUrl);
      }
    } else if (product.image) {
      const testUrl = generateImageUrl(product.image);
      if (testUrl) {
        testImageUrl(testUrl);
      }
    }


    const banner = product.media?.length ? (
      product.media?.map((media, index) => {
        // Use SmartImage as fallback if regular Image failed
        if (failedImages[media.path]) {
        return (
            <TouchableOpacity onPress={() => setIsFullImage(true)} key={`${index}-smartimage`}>
              <SmartImage
                imagePath={media.path}
                style={styles.swiperImg}
                placeholderText="No Image"
                onLoad={() => console.log('SmartImage loaded successfully:', media.path)}
                onError={() => console.log('SmartImage failed to load:', media.path)}
              />
            </TouchableOpacity>
          );
        }
        
        const imageUrl = generateImageUrl(media.path);
        return (
          <TouchableOpacity onPress={() => setIsFullImage(true)} key={`${index}-primary`}>
            <Image
              style={styles.swiperImg}
              source={{ uri: imageUrl }}
              resizeMode="stretch"
              onError={(error) => {
                console.log('Media image failed to load:', media.path, error);
                if (!failedImages[media.path]) {
                  setFailedImages(prev => ({ ...prev, [media.path]: true }));
                }
              }}
              onLoad={() => {
                console.log('Media image loaded successfully:', media.path);
              }}
            />
          </TouchableOpacity>
        );
      })
    ) : product.image ? (
      // Use SmartImage as fallback if regular Image failed
      failedImages[product.image] ? (
        <TouchableOpacity onPress={() => setIsFullImage(true)}>
          <SmartImage
            imagePath={product.image}
            style={styles.swiperImg}
            placeholderText="No Image"
            onLoad={() => console.log('SmartImage loaded successfully:', product.image)}
            onError={() => console.log('SmartImage failed to load:', product.image)}
          />
        </TouchableOpacity>
      ) : (
      <TouchableOpacity onPress={() => setIsFullImage(true)}>
        <Image
          style={styles.swiperImg}
            source={{ uri: generateImageUrl(product.image) }}
          onError={(error) => {
              console.log('Image failed to load:', product.image, error);
            if (!failedImages[product.image]) {
              setFailedImages(prev => ({ ...prev, [product.image]: true }));
            }
          }}
            onLoad={() => {
              console.log('Image loaded successfully:', product.image);
            }}
        />
      </TouchableOpacity>
      )
    ) : null;

    const imageViewerImages = product?.media?.length
      ? product?.media.map((media) => ({
          url: generateImageUrl(media.path),
          width: SCREEN_WIDTH,
          height: 232,
        }))
      : product.image ? [{
          url: generateImageUrl(product.image),
          width: SCREEN_WIDTH,
          height: 232,
        }] : [];

    return (
      <View style={[styles.headerContainer, { backgroundColor: isDark ? colors.navyBlue : "#fff" }]}>
        {/* Product Image */}
        <View style={styles.imageSection}>
          {(product.media?.length || product.image) ? (
            <Swiper
              autoplay
              style={styles.swiper}
              dot={<View style={styles.dot} />}
              activeDot={<View style={[styles.dot, { backgroundColor: isDark ? colors.green : colors.darkBlue }]} />}
              removeClippedSubviews={false}
            >
              {banner}
            </Swiper>
          ) : (
            <View style={styles.placeholderImage}>
              <TypographyText
                title="📷"
                size={48}
                textColor={isDark ? colors.lightGrey : colors.darkGrey}
              />
              <TypographyText
                title={t("GlobalTix.productDetails.ui.noImageAvailable")}
                size={14}
                textColor={isDark ? colors.lightGrey : colors.darkGrey}
                style={{ marginTop: 8 }}
              />
            </View>
          )}
        </View>

        {/* Product Info */}
        <View style={styles.productInfo}>
          <View style={styles.categorySection}>
            <TypographyText
              title={displayProduct.category || "Others"}
              size={14}
              textColor={isDark ? colors.lightGrey : colors.darkGrey}
            />
            <View style={styles.productId}>
              <TypographyText
                title={displayProduct.id || "12345"}
                size={12}
                textColor={colors.white}
              />
            </View>
          </View>

          <View style={styles.titleSection}>
            <TypographyText
              title={displayProduct.name}
              size={24}
              font={BALOO_SEMIBOLD}
              textColor={isDark ? colors.white : colors.black}
              style={styles.productTitle}
            />
          </View>

          {/* Highlights */}
          {displayProduct.highlights && displayProduct.highlights.length > 0 && (
            <View style={styles.highlightsSection}>
              <TypographyText
                title={t("GlobalTix.productDetails.ui.highlights")}
                size={18}
                font={BALOO_SEMIBOLD}
                textColor={isDark ? colors.white : colors.black}
                style={styles.highlightsTitle}
              />
              {displayProduct.highlights.map((highlight, index) => (
                <View key={index} style={styles.highlightItem}>
                  <TypographyText
                    title={`• ${highlight}`}
                    size={14}
                    textColor={isDark ? colors.lightGrey : colors.darkGrey}
                  />
                </View>
              ))}
            </View>
          )}

          {/* Location */}
          <View style={styles.locationSection}>
            <TypographyText
              title={`${displayProduct.city}, ${displayProduct.country}`}
              size={14}
              textColor={isDark ? colors.lightGrey : colors.darkGrey}
            />
          </View>
        </View>

        {/* Navigation Tabs */}
        <ScrollView
          contentContainerStyle={styles.tabsContainer}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
        >
          {tabs.map((item) => {
            const isActive = item.key === activeTab;
            const activeBorder = isDark ? colors.mainDarkMode : colors.darkBlue;
            const passiveBorder = isDark ? colors.borderGrey : colors.lightGrey;

            return (
              <TouchableOpacity
                key={item.key}
                style={[
                  styles.tab,
                  {
                    borderColor: isActive ? activeBorder : passiveBorder,
                    backgroundColor: isActive ? (isDark ? colors.mainDarkMode : colors.darkBlue) : 'transparent',
                  },
                ]}
                onPress={() => setActiveTab(item.key)}
              >
                <TypographyText
                  textColor={isActive ? colors.white : (isDark ? colors.white : colors.darkBlue)}
                  size={15}
                  font={BALOO_SEMIBOLD}
                  title={item.label}
                />
              </TouchableOpacity>
            );
          })}
        </ScrollView>




        {/* Image Viewer Modal */}
        <Modal visible={isFullImage} transparent={true}>
          <ImageViewer
            supportedOrientations={["portrait", "portrait-upside-down", "landscape", "landscape-left", "landscape-right"]}
            pageAnimateTime={100}
            saveToLocalByLongPress={false}
            index={0}
            renderImage={({ source, style }) => (
              <View style={styles.imageViewerContainer}>
                <Image
                  source={{ uri: source.uri }}
                  style={[styles.fullImage, style]}
                  resizeMode="contain"
                />
              </View>
            )}
            renderHeader={() => (
              <View style={styles.imageViewerHeader}>
                <TouchableOpacity
                  onPress={() => setIsFullImage(false)}
                  style={styles.closeButton}
                >
                  <CloseIcon />
                </TouchableOpacity>
              </View>
            )}
            onSwipeDown={() => setIsFullImage(false)}
            enableSwipeDown={true}
            imageUrls={imageViewerImages}
            loadingRender={() => (
              <ActivityIndicator size={"large"} color={colors.green} />
            )}
          />
        </Modal>

      </View>
    );
  }, [product, translatedProduct, isFullImage, activeTab, isDark, selectedDate]);

  const renderTicketsTab = () => {
    // Use translated options if available, otherwise fallback to original
    const displayOptions = translatedOptions.length > 0 ? translatedOptions : options;
    if (!displayOptions || displayOptions.length === 0) {
      return (
        <View style={styles.noTicketsContainer}>
          <View style={styles.ticketGraphic}>
            <TypographyText
              title="TICKET"
              size={24}
              font={BALOO_SEMIBOLD}
              textColor={colors.darkBlue}
            />
            <View style={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TypographyText key={star} title="⭐" size={16} />
              ))}
            </View>
            <View style={styles.ticketNumbers}>
              <TypographyText title="12345" size={12} textColor={colors.darkBlue} />
              <TypographyText title="12345" size={12} textColor={colors.darkBlue} />
            </View>
          </View>
          <TypographyText
            title={t("GlobalTix.productDetails.ui.noTicketsFound")}
            size={18}
            font={BALOO_SEMIBOLD}
            textColor={isDark ? colors.white : colors.black}
            style={styles.noTicketsMessage}
          />
          <TypographyText
            title={t("GlobalTix.productDetails.ui.trySearchingElse")}
            size={14}
            textColor={isDark ? colors.lightGrey : colors.darkGrey}
          />
          <TouchableOpacity style={styles.backToHomeButton}>
            <TypographyText
              title={t("GlobalTix.productDetails.buttons.backToHome")}
              size={16}
              font={BALOO_SEMIBOLD}
              textColor={colors.white}
            />
          </TouchableOpacity>
        </View>
      );
    }

    const renderTicketDetails = (ticket, option) => {
      const ticketId = `${option.id}-${ticket.id}`;
      const isExpanded = expandedTickets[ticketId];
      const isSelected = selectedTickets[option.id] === ticket.id;
      const cartKey = `${option.id}_${ticket.id}`;
      const availabilityStatus = ticketAvailabilityStatus[cartKey];
      const isAddingToCartLoading = isAddingToCart[cartKey];
      

      return (
        <View 
          key={ticketId} 
          style={[
            styles.ticketTypeContainer,
            isSelected && styles.selectedTicketContainer
          ]}
        >
          {/* Ticket Selection Area */}
          <TouchableOpacity 
            style={[
              styles.ticketTypeRow,
              currentLanguage === 'ar' && { flexDirection: 'row-reverse' }
            ]}
            onPress={() => {
              console.log('Ticket pressed - option.id:', option.id, 'ticket.id:', ticket.id);
              handleSelectTicket(option.id, ticket.id);
            }}
          >
            <View style={[
              styles.ticketTypeInfo,
              currentLanguage === 'ar' && { alignItems: 'flex-end' }
            ]}>
              <View style={styles.ticketTypeHeader}>
                <TypographyText
                  title={`${t("GlobalTix.productDetails.ui.ticketType")} ${ticket.name || ticket.type || 'Per Pax'}`}
                  size={14}
                  font={BALOO_SEMIBOLD}
                  textColor={isSelected ? (colors.mainDarkMode || '#DDBD6B') : (isDark ? colors.white : colors.black)}
                  style={currentLanguage === 'ar' ? { textAlign: 'right' } : {}}
                />

              </View>
              <TypographyText
                title={`ID: ${ticket.id}`}
                size={12}
                textColor={isDark ? colors.lightGrey : colors.darkGrey}
                style={currentLanguage === 'ar' ? { textAlign: 'right' } : {}}
              />
              <TypographyText
                title={`SKU: ${ticket.sku || 'N/A'}`}
                size={12}
                textColor={isDark ? colors.lightGrey : colors.darkGrey}
                style={currentLanguage === 'ar' ? { textAlign: 'right' } : {}}
              />
              {isSelected && (
                <TypographyText
                  title={`✓ ${t("GlobalTix.productDetails.ui.selected")} (${t("GlobalTix.productDetails.ui.tapToUnselect")})`}
                  size={12}
                  font={BALOO_SEMIBOLD}
                  textColor={colors.mainDarkMode || '#DDBD6B'}
                  style={{ marginTop: 4, ...(currentLanguage === 'ar' ? { textAlign: 'right' } : {}) }}
                />
              )}
            </View>

            <View style={{
              alignItems: currentLanguage === 'ar' ? "flex-start" : "flex-end"
            }}>
               {/* Availability Status Indicator */}
               {availabilityStatus && (
                  <TypographyText
                    title={`${availabilityStatus.status === 'available' ? '✅' : '❌'} ${availabilityStatus.status === 'available' ? t("GlobalTix.productDetails.ui.available") : t("GlobalTix.productDetails.ui.unavailable")}`}
                    size={12}
                    font={BALOO_SEMIBOLD}
                    textColor={availabilityStatus.status === 'available' ? colors.blue || '#2196F3' : colors.red}
                    style={{  }}
                  />
                )}
            {/* Expand/Collapse Button */}
          <TouchableOpacity 
            style={styles.expandButton}
            onPress={() => {
              handleToggleExpanded(ticketId);
            }}
          >
            <TypographyText
              title={isExpanded ? t("GlobalTix.productDetails.ui.hideTicketInfo") : t("GlobalTix.productDetails.ui.showTicketInfo")}
              size={12}
              font={BALOO_SEMIBOLD}
              textColor={isDark ? colors.black : colors.black}
            />
            <TypographyText
              title={isExpanded ? "▲" : "▼"}
              size={12}
              textColor={isDark ? colors.black : colors.black}
              style={{ marginLeft: 4 }}
            />
          </TouchableOpacity>
          </View>
          </TouchableOpacity>
          
          

          {/* Expanded Content */}
          {isExpanded && (
            <View style={styles.expandedContent}>
              {/* Pricing Details Section */}
              <View style={[
                styles.pricingDetailsSection,
                { backgroundColor: isDark ? colors.navyBlue : colors.lightGrey }
              ]}>
                <TypographyText
                  title={t("GlobalTix.productDetails.ui.pricingDetails")}
                  size={16}
                  font={BALOO_SEMIBOLD}
                  textColor={isDark ? colors.white : colors.black}
                  style={styles.pricingTitle}
                />
                
                {/* <View style={styles.pricingRow}>
                  <TypographyText
                    title={t("GlobalTix.productDetails.ui.originalMerchantPrice")}
                    size={14}
                    textColor={isDark ? colors.lightGrey : colors.darkGrey}
                    style={styles.pricingLabel}
                  />
                  <TypographyText
                    title={convertedPrices[`${option.id}_${ticket.id}_original`] || `${ticket.originalMerchantPrice || ticket.original_price || 'N/A'}`}
                    size={14}
                    font={BALOO_SEMIBOLD}
                    textColor={isDark ? colors.white : colors.black}
                    style={styles.pricingValue}
                  />
                </View> */}
                
                {/* <View style={styles.pricingRow}>
                  <TypographyText
                    title={t("GlobalTix.productDetails.ui.minimumMerchantSellingPrice")}
                    size={14}
                    textColor={isDark ? colors.lightGrey : colors.darkGrey}
                    style={styles.pricingLabel}
                  />
                  <TypographyText
                    title={convertedPrices[`${option.id}_${ticket.id}_min`] || `${ticket.minimumMerchantSellingPrice || ticket.min_selling_price || 'N/A'}`}
                    size={14}
                    font={BALOO_SEMIBOLD}
                    textColor={isDark ? colors.white : colors.black}
                    style={styles.pricingValue}
                  />
                </View> */}
                
                {/* Display Selling Price (marked up price) to customers */}
                <View style={styles.pricingRow}>
                  <TypographyText
                    title={t("GlobalTix.productDetails.ui.sellingPrice") || "Selling Price:"}
                    size={14}
                    textColor={isDark ? colors.lightGrey : colors.darkGrey}
                    style={styles.pricingLabel}
                  />
                  <TypographyText
                    title={convertedPrices[`${option.id}_${ticket.id}_selling`] || (() => {
                      // Fallback: calculate selling price on the fly
                      const markupPercentage = GLOBALTIX_CONFIG.DEFAULT_MARKUP_PERCENTAGE;
                      const pricing = getTicketSellingPrice(ticket, markupPercentage);
                      return `${pricing.sellingPrice || 'N/A'}`;
                    })()}
                    size={14}
                    font={BALOO_SEMIBOLD}
                    textColor={isDark ? colors.white : colors.black}
                    style={styles.pricingValue}
                  />
                </View>
                
                {/* Display Nett Price (B2B rate) - for reference only, can be hidden */}
                {/* <View style={styles.pricingRow}>
                  <TypographyText
                    title={t("GlobalTix.productDetails.ui.nettPrice")}
                    size={14}
                    textColor={isDark ? colors.lightGrey : colors.darkGrey}
                    style={styles.pricingLabel}
                  />
                  <TypographyText
                    title={convertedPrices[`${option.id}_${ticket.id}_nett`] || `${ticket.nettPrice || ticket.net_price || 'N/A'}`}
                    size={14}
                    font={BALOO_SEMIBOLD}
                    textColor={isDark ? colors.white : colors.black}
                    style={styles.pricingValue}
                  />
                </View> */}
                
                {/* <View style={styles.pricingRow}>
                  <TypographyText
                    title={t("GlobalTix.productDetails.ui.agentRate")}
                    size={14}
                    textColor={isDark ? colors.lightGrey : colors.darkGrey}
                    style={styles.pricingLabel}
                  />
                  <TypographyText
                    title={convertedPrices[`${option.id}_${ticket.id}_agent`] || `${ticket.agentRate || ticket.agent_rate || 'N/A'}`}
                    size={14}
                    font={BALOO_SEMIBOLD}
                    textColor={isDark ? colors.white : colors.black}
                    style={styles.pricingValue}
                  />
                </View> */}
              </View>

              {/* Validity Icons */}
              <View style={styles.validityIcons}>
                {/* Validity Duration */}
                {!!option.definedDuration && (
                  <View style={styles.validityIcon}>
                    <TypographyText title="📅" size={16} />
                    <TypographyText
                      title={`${option.definedDuration} ${t("GlobalTix.productDetails.ui.days")}`}
                      size={12}
                      textColor={isDark ? colors.lightGrey : colors.darkGrey}
                    />
                  </View>
                )}
                
                {/* Cancellable Status */}
                <View style={styles.validityIcon}>
                  <TypographyText title={option.isCancellable ? "✅" : "🚫"} size={16} />
                  <TypographyText
                    title={option.isCancellable 
                      ? t("GlobalTix.productDetails.ui.cancellable") 
                      : t("GlobalTix.productDetails.ui.nonCancellable")}
                    size={12}
                    textColor={isDark ? colors.lightGrey : colors.darkGrey}
                  />
                </View>
                
                {/* Instant Confirmation */}
                <View style={styles.validityIcon}>
                  <TypographyText title="⚡" size={16} />
                  <TypographyText
                    title={t("GlobalTix.productDetails.ui.instant")}
                    size={12}
                    textColor={isDark ? colors.lightGrey : colors.darkGrey}
                  />
                </View>
                
                {/* Date Type */}
                {option.visitDate && (
                  <View style={styles.validityIcon}>
                    <TypographyText title="📅" size={16} />
                    <TypographyText
                      title={option.visitDate.isOpenDated 
                        ? t("GlobalTix.productDetails.ui.openDated") 
                        : option.visitDate.required 
                          ? t("GlobalTix.productDetails.ui.dated")
                          : t("GlobalTix.productDetails.ui.flexible")}
                      size={12}
                      textColor={isDark ? colors.lightGrey : colors.darkGrey}
                    />
                  </View>
                )}
              </View>

              {/* Quantity Selector */}
              <View style={styles.quantitySelector}>
                <View style={styles.quantityHeader}>
                  <TypographyText
                    title={t("GlobalTix.productDetails.ui.quantity")}
                    size={14}
                    font={BALOO_SEMIBOLD}
                    textColor={isDark ? colors.white : colors.black}
                    style={styles.quantityLabel}
                  />
                  {getCartQuantity(option.id, ticket.id) > 0 && (
                    <TypographyText
                      title={t("GlobalTix.productDetails.ui.inCart")}
                      size={12}
                      font={BALOO_SEMIBOLD}
                      textColor={colors.darkBlue || '#1976D2'}
                      style={styles.inCartLabel}
                    />
                  )}
                </View>
                <View style={styles.quantityControls}>
                  <TouchableOpacity
                    style={[styles.quantityButton, !!isAddingToCartLoading && styles.disabledButton]}
                    onPress={() => handleQuantityChange(option.id, ticket.id, -1)}
                    disabled={!!isAddingToCartLoading}
                  >
                    <TypographyText title="-" size={18} textColor={colors.white} />
                  </TouchableOpacity>
                  <View style={styles.quantityDisplay}>
                    {!!isAddingToCartLoading ? (
                      <ActivityIndicator size="small" color={isDark ? colors.white : colors.black} />
                    ) : (
                      <TypographyText
                        title={String(getCartQuantity(option.id, ticket.id))}
                        size={16}
                        font={BALOO_SEMIBOLD}
                        textColor={isDark ? colors.white : colors.white}
                      />
                    )}
                  </View>
                  <TouchableOpacity
                    style={[styles.quantityButton, !!isAddingToCartLoading && styles.disabledButton]}
                    onPress={() => handleQuantityChange(option.id, ticket.id, 1)}
                    disabled={!!isAddingToCartLoading}
                  >
                    <TypographyText title="+" size={18} textColor={colors.white} />
                  </TouchableOpacity>
                </View>
              </View>


              {/* Detailed Information */}
              <View style={styles.detailedInfo}>
                {/* Description/Important Notes */}
                {option.description && (
                  <View style={styles.infoDetailSection}>
                    <TypographyText
                      title={t("GlobalTix.productDetails.ui.descriptionImportantNotes")}
                      size={14}
                      font={BALOO_SEMIBOLD}
                      textColor={isDark ? colors.white : colors.black}
                      style={styles.detailTitle}
                    />
                    <TypographyText
                      title={option.description}
                      size={12}
                      textColor={isDark ? colors.lightGrey : colors.darkGrey}
                      style={styles.detailItem}
                    />
                  </View>
                )}

               

                {/* Inclusions */}
                {option.inclusions && option.inclusions.length > 0 && option.ticketValidity !== "VisitDate" && (
                  <View style={styles.infoDetailSection}>
                    <TypographyText
                      title={t("GlobalTix.productDetails.ui.inclusions")}
                      size={14}
                      font={BALOO_SEMIBOLD}
                      textColor={isDark ? colors.white : colors.black}
                      style={styles.detailTitle}
                    />
                    {option.inclusions.map((inclusion, index) => (
                      <TypographyText
                        key={index}
                        title={`• ${inclusion}`}
                        size={12}
                        textColor={isDark ? colors.lightGrey : colors.darkGrey}
                        style={styles.detailItem}
                      />
                    ))}
                  </View>
                )}

                {/* Exclusions */}
                {option.exclusions && option.exclusions.length > 0 ? (
                  <View style={styles.infoDetailSection}>
                    <TypographyText
                      title={t("GlobalTix.productDetails.ui.exclusions")}
                      size={14}
                      font={BALOO_SEMIBOLD}
                      textColor={isDark ? colors.white : colors.black}
                      style={styles.detailTitle}
                    />
                    {option.exclusions.map((exclusion, index) => (
                      <TypographyText
                        key={index}
                        title={`• ${exclusion}`}
                        size={12}
                        textColor={isDark ? colors.lightGrey : colors.darkGrey}
                        style={styles.detailItem}
                      />
                    ))}
                  </View>
                ) : (
                  <View style={styles.infoDetailSection}>
                    <TypographyText
                      title={t("GlobalTix.productDetails.ui.exclusions")}
                      size={14}
                      font={BALOO_SEMIBOLD}
                      textColor={isDark ? colors.white : colors.black}
                      style={styles.detailTitle}
                    />
                    <TypographyText
                      title={t("GlobalTix.productDetails.placeholders.noSpecificExclusions")}
                      size={12}
                      textColor={isDark ? colors.lightGrey : colors.darkGrey}
                      style={styles.detailItem}
                    />
                  </View>
                )}

                {/* How to Use */}
                {option.howToUse && option.howToUse.length > 0 && (
                  <View style={styles.infoDetailSection}>
                    <TypographyText
                      title={t("GlobalTix.productDetails.ui.howToUse")}
                      size={14}
                      font={BALOO_SEMIBOLD}
                      textColor={isDark ? colors.white : colors.black}
                      style={styles.detailTitle}
                    />
                    {option.howToUse.map((instruction, index) => (
                      <TypographyText
                        key={index}
                        title={`• ${instruction}`}
                        size={12}
                        textColor={isDark ? colors.lightGrey : colors.darkGrey}
                        style={styles.detailItem}
                      />
                    ))}
                  </View>
                )}

                {/* Cancellation Policy */}
                {((option.cancellationNotes && option.cancellationNotes.length > 0) || option.cancellationPolicy) && (
                  <View style={styles.infoDetailSection}>
                    <TypographyText
                      title={t("GlobalTix.productDetails.ui.cancellationPolicy")}
                      size={14}
                      font={BALOO_SEMIBOLD}
                      textColor={isDark ? colors.white : colors.black}
                      style={styles.detailTitle}
                    />
                    {option.cancellationPolicy && (
                      <TypographyText
                        title={
                          typeof option.cancellationPolicy === 'object' && option.cancellationPolicy !== null
                            ? `Refund: ${option.cancellationPolicy.percentReturn || 0}% within ${option.cancellationPolicy.refundDuration || 0} days`
                            : String(option.cancellationPolicy)
                        }
                        size={12}
                        textColor={isDark ? colors.lightGrey : colors.darkGrey}
                        style={styles.detailItem}
                      />
                    )}
                    {option.cancellationNotes && option.cancellationNotes.map((note, index) => (
                      <TypographyText
                        key={index}
                        title={`• ${note}`}
                        size={12}
                        textColor={isDark ? colors.lightGrey : colors.darkGrey}
                        style={styles.detailItem}
                      />
                    ))}
                  </View>
                )}

                {/* Terms and Conditions */}
                {option.termsAndConditions && (
                  <View style={styles.infoDetailSection}>
                    <TypographyText
                      title={t("GlobalTix.productDetails.ui.termsConditions")}
                      size={14}
                      font={BALOO_SEMIBOLD}
                      textColor={isDark ? colors.white : colors.black}
                      style={styles.detailTitle}
                    />
                    <TypographyText
                      title={option.termsAndConditions}
                      size={12}
                      textColor={isDark ? colors.lightGrey : colors.darkGrey}
                      style={styles.detailItem}
                    />
                  </View>
                )}
              </View>
            </View>
          )}
        </View>
      );
    };

    return (
      <ScrollView style={styles.ticketsContainer} showsVerticalScrollIndicator={false}>
        {/* Date Selection Display */}
        {/* {selectedDate ? (
          <View style={styles.dateSelectionContainer}>
            <TouchableOpacity 
                style={styles.selectedDateContainer}
                onPress={() => setIsDatePickerVisible(true)}
                activeOpacity={0.7}
              >
                <TypographyText title="📅" size={16} style={styles.dateIcon} />
                <TypographyText
                  title={`${t("GlobalTix.productDetails.ui.selectedVisitDate")}: ${selectedDate.toLocaleDateString()}`}
                  size={14}
                  font={BALOO_SEMIBOLD}
                  textColor={colors.blue || '#2196F3'}
                  style={styles.selectedDateText}
                />
                <TypographyText title="✏️" size={14} style={styles.editIcon} />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.dateSelectionContainer}>
            <TouchableOpacity 
                style={styles.selectDateButton}
                onPress={() => setIsDatePickerVisible(true)}
                activeOpacity={0.7}
              >
                <TypographyText title="📅" size={16} style={styles.dateIcon} />
                <TypographyText
                  title={t("GlobalTix.productDetails.ui.selectVisitDate")}
                  size={14}
                  font={BALOO_SEMIBOLD}
                  textColor={colors.blue || '#2196F3'}
                  style={styles.selectDateText}
                />
                <TypographyText title="➡️" size={14} style={styles.arrowIcon} />
            </TouchableOpacity>
          </View>
        )} */}

        {/* Instructions when no date is selected */}
        {/* {!selectedDate && (
          <View style={styles.instructionsContainer}>
            <TypographyText
              title={t("GlobalTix.productDetails.ui.selectVisitDateMessage")}
              size={14}
              font={BALOO_REGULAR}
              textColor={colors.gray || '#666'}
              style={styles.instructionsText}
            />
          </View>
        )} */}

        {displayOptions.map((option, index) => (
          <View key={index} style={[styles.ticketOption,{backgroundColor: isDark ? colors.borderGrey : colors.white}]}>
            {/* Option Header */}
            <View style={styles.optionHeader}>
              <View style={styles.optionTitleSection}>
                <TypographyText
                  title={option.name}
                  size={16}
                  font={BALOO_SEMIBOLD}
                  textColor={colors.white}
                />
                <TypographyText
                  title={`${t("GlobalTix.productDetails.ui.productOptionId")} ${option.id}`}
                  size={12}
                  textColor={colors.lightGrey}
                />
              </View>
            </View>

            {/* Ticket Details */}
            <View style={styles.ticketDetails}>
              {option.ticketType && option.ticketType.map((ticket, ticketIndex) => 
                renderTicketDetails(ticket, option)
              )}
            </View>
          </View>
        ))}
      </ScrollView>
    );
  };

  const renderPackagesTab = () => (
    <View style={styles.tabContent}>
      <TypographyText
        title={t("GlobalTix.productDetails.ui.packagesTransportationPlaceholder")}
        size={16}
        textColor={isDark ? colors.white : colors.black}
        style={styles.placeholderText}
      />
    </View>
  );



  const renderInfoTab = () => {
    // Use translated product if available, otherwise fallback to original
    const displayProduct = translatedProduct || product;
    if (!displayProduct) return null;


    // Helper function to extract meaningful text from object data
    const extractTextFromObject = (obj) => {
      if (typeof obj === 'string') return obj;
      if (typeof obj === 'object' && obj !== null) {
        // Try to find common text fields
        if (obj.text) return obj.text;
        if (obj.description) return obj.description;
        if (obj.content) return obj.content;
        if (obj.message) return obj.message;
        if (obj.title) return obj.title;
        if (obj.name) return obj.name;
        // If none found, return a formatted string
        return Object.entries(obj)
          .filter(([key, value]) => typeof value === 'string' && value.trim())
          .map(([key, value]) => `${key}: ${value}`)
          .join('\n') || 'No available information as of the moment. Please check again later.';
      }
      return String(obj || 'No available information as of the moment. Please check again later.');
    };

    const renderInfoSection = (title, content, icon = "📄") => {
      // Use the helper function to extract meaningful text
      const displayContent = extractTextFromObject(content);
      
      // Check if content contains HTML tags
      const isHTML = typeof displayContent === 'string' && /<[^>]+>/.test(displayContent);

      return (
        <View style={styles.infoSection}>
          <View style={styles.infoHeader}>
            <TypographyText title={icon} size={16} />
            <TypographyText
              title={title}
              size={16}
              font={BALOO_SEMIBOLD}
              textColor={isDark ? colors.white : colors.black}
              style={styles.infoTitle}
            />
          </View>
          {isHTML ? (
            <View style={styles.infoContent}>
              <HTMLRenderer 
                value={displayContent}
                color={isDark ? colors.lightGrey : colors.darkGrey}
              />
            </View>
          ) : (
            <TypographyText
              title={displayContent}
              size={14}
              textColor={isDark ? colors.lightGrey : colors.darkGrey}
              style={styles.infoContent}
            />
          )}
        </View>
      );
    };

    const renderDateButtons = () => (
      <View style={styles.infoSection}>
        <View style={styles.infoHeader}>
          <TypographyText title="📅" size={16} />
          <TypographyText
            title={t("GlobalTix.productDetails.ui.blockedOutDates")}
            size={16}
            font={BALOO_SEMIBOLD}
            textColor={isDark ? colors.white : colors.black}
            style={styles.infoTitle}
          />
        </View>
        <View style={styles.dateButtonsContainer}>
          <TouchableOpacity style={styles.dateButton}>
            <TypographyText
              title={t("GlobalTix.productDetails.ui.monthYear")}
              size={14}
              font={BALOO_SEMIBOLD}
              textColor={colors.white}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.dateButton}>
            <TypographyText
              title={t("GlobalTix.productDetails.ui.date")}
              size={14}
              font={BALOO_SEMIBOLD}
              textColor={colors.white}
            />
          </TouchableOpacity>
        </View>
      </View>
    );

          return (
        <ScrollView style={styles.infoTabContainer} showsVerticalScrollIndicator={false}>
          {/* Description */}
        {/* Only show description if it exists and is not empty */}
        {displayProduct.description && displayProduct.description.trim() && (
          renderInfoSection(
            t("GlobalTix.productDetails.ui.description"),
            displayProduct.description,
            "📄"
          )
        )}

        {/* Good To Know */}
        {renderInfoSection(
          t("GlobalTix.productDetails.ui.goodToKnow"),
          displayProduct.goodToKnow || t("GlobalTix.productDetails.placeholders.noInformationAvailable"),
          "📄"
        )}

        {/* What to Expect - Multiple sections */}
        {Array.isArray(displayProduct.whatToExpect) && displayProduct.whatToExpect.length > 0 ? (
          displayProduct.whatToExpect.map((item, index) => 
            renderInfoSection(
              t("GlobalTix.productDetails.ui.whatToExpect"),
              item || t("GlobalTix.productDetails.placeholders.noInformationAvailable"),
              "📄"
            )
          )
        ) : (
          renderInfoSection(
            t("GlobalTix.productDetails.ui.whatToExpect"),
            displayProduct.whatToExpect || t("GlobalTix.productDetails.placeholders.noInformationAvailable"),
            "📄"
          )
        )}

        {/* Things to Note - Multiple sections */}
        {Array.isArray(displayProduct.thingsToNote) && displayProduct.thingsToNote.length > 0 ? (
          displayProduct.thingsToNote.map((item, index) => 
            renderInfoSection(
              t("GlobalTix.productDetails.ui.thingsToNote"),
              item || t("GlobalTix.productDetails.placeholders.noInformationAvailable"),
              "📄"
              )
            )
          ) : (
            renderInfoSection(
              t("GlobalTix.productDetails.ui.thingsToNote"),
              displayProduct.thingsToNote || t("GlobalTix.productDetails.placeholders.noInformationAvailable"),
              "📄"
            )
          )}

        {/* Operating Hours */}
        {renderInfoSection(
          t("GlobalTix.productDetails.ui.operatingHours"),
          product.operatingHours || t("GlobalTix.productDetails.placeholders.dailyOperatingHours"),
          "📄"
        )}

        {/* Blocked Out Dates 
        {renderDateButtons()} */}
      </ScrollView>
    );
  };

  if (!productId) {
    return (
      <MainLayout
        headerChildren={
          <Header 
            label={t("GlobalTix.productDetails.title")} 
            btns={["back", "GlobalTix"]} 
            additionalBtnsProps={{
              cart: {
                onPress: () => {
                  navigation.navigate('GlobalTixCart');
                }
              }
            }}
          />
        }
        headerHeight={50}
      >
        <View style={styles.errorContainer}>
          <TypographyText
            title={t("GlobalTix.productDetails.alerts.noProductId")}
            size={18}
            font={BALOO_SEMIBOLD}
            textColor={colors.red}
            style={styles.errorText}
          />
        </View>
      </MainLayout>
    );
  }

  if (loading) {
    return (
      <MainLayout
        headerChildren={
          <Header 
            label={t("GlobalTix.productDetails.title")} 
            btns={["back", "GlobalTix"]} 
            additionalBtnsProps={{
              cart: {
                onPress: () => {
                  navigation.navigate('GlobalTixCart');
                }
              }
            }}
          />
        }
        headerHeight={50}
      >
        <FullScreenLoader />
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout
        headerChildren={
          <Header 
            label={t("GlobalTix.productDetails.title")} 
            btns={["back", "GlobalTix"]} 
            additionalBtnsProps={{
              cart: {
                onPress: () => {
                  navigation.navigate('GlobalTixCart');
                }
              }
            }}
          />
        }
        headerHeight={50}
      >
        <View style={styles.errorContainer}>
          <TypographyText
            title={`${t("GlobalTix.productDetails.alerts.error")}: ${error}`}
            size={18}
            font={BALOO_SEMIBOLD}
            textColor={colors.red}
            style={styles.errorText}
          />
        </View>
      </MainLayout>
    );
  }

  if (!product) {
    return (
      <MainLayout
        headerChildren={
          <Header 
            label={t("GlobalTix.productDetails.title")} 
            btns={["back", "GlobalTix"]} 
            additionalBtnsProps={{
              cart: {
                onPress: () => {
                  navigation.navigate('GlobalTixCart');
                }
              }
            }}
          />
        }
        headerHeight={50}
      >
        <View style={styles.errorContainer}>
          <TypographyText
            title={t("GlobalTix.productDetails.alerts.productNotFound")}
            size={18}
            font={BALOO_SEMIBOLD}
            textColor={colors.red}
            style={styles.errorText}
          />
        </View>
      </MainLayout>
    );
  }

  return (
    <MainLayout
    outsideScroll={true}
      headerChildren={<Header label={t("GlobalTix.productDetails.title")} btns={["back","GlobalTix"]}
      additionalBtnsProps={{
        cart: {
          onPress: () => navigation.navigate('GlobalTixCartScreen')
        }
      }} />}
      headerHeight={50}
      contentStyle={{ paddingHorizontal: 0, height: SCREEN_HEIGHT - 100 }}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}
      >
        {renderHeader()}
        {activeTab === CONSTANTS.TICKETS && renderTicketsTab()}
        {activeTab === CONSTANTS.PACKAGES && renderPackagesTab()}
        {activeTab === CONSTANTS.INFO && renderInfoTab()}
      </ScrollView>
      
      {/* Date Picker Modal */}
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleDateConfirm}
        onCancel={handleDateCancel}
        minimumDate={new Date()}
      />
      
      {/* GlobalTix Cart 
      <GlobalTixCart onPress={() => {
        navigation.navigate('GlobalTixCart');
      }} />*/}
    </MainLayout>
  );
};

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    textAlign: 'center',
  },
  headerContainer: {
    paddingBottom: 44,
  },
  imageSection: {
    marginTop: 14,
    paddingHorizontal: 20,
  },
  swiper: {
    height: 232,
  },
  swiperImg: {
    width: '100%',
    height: 232,
    borderRadius: 12,
  },
  placeholderImage: {
    width: '100%',
    height: 232,
    borderRadius: 12,
    backgroundColor: colors.lightGrey,
    justifyContent: 'center',
    alignItems: 'center',
  },

  dot: {
    backgroundColor: colors.lightGrey,
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 3,
    marginRight: 3,
    marginTop: 3,
    marginBottom: 3,
  },

  productInfo: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  categorySection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  productId: {
    backgroundColor: colors.darkBlue,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginLeft: 10,
  },
  titleSection: {
    marginBottom: 20,
  },
  productTitle: {
    marginBottom: 10,
  },
  highlightsSection: {
    marginBottom: 20,
  },
  highlightsTitle: {
    marginBottom: 10,
  },
  highlightItem: {
    marginBottom: 5,
  },
  locationSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  tabsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 10,
  },
  dateSelectionContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  selectedDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    marginTop: 8,
    borderWidth: 2,
    borderColor: colors.blue || '#2196F3',
  },
  selectDateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.lightBlue || '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 8,
    borderWidth: 2,
    borderColor: colors.blue || '#2196F3',
    borderStyle: 'dashed',
  },
  dateIcon: {
    marginRight: 8,
  },
  selectedDateText: {
    flex: 1,
  },
  selectDateText: {
    flex: 1,
  },
  editIcon: {
    marginLeft: 8,
    opacity: 0.7,
  },
  arrowIcon: {
    marginLeft: 8,
    opacity: 0.7,
  },
  instructionsContainer: {
    paddingHorizontal: 20,
    marginBottom: 15,
    backgroundColor: colors.lightGray || '#F5F5F5',
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 20,
  },
  instructionsText: {
    textAlign: 'center',
    lineHeight: 20,
  },
  checkAvailabilityButton: {
    backgroundColor: colors.darkBlue,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  loadingButton: {
    backgroundColor: colors.lightGrey,
    opacity: 0.7,
  },
  refreshButton: {
    backgroundColor: colors.lightGrey,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  clearAllButton: {
    backgroundColor: colors.lightGrey,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    paddingHorizontal: 20,
    marginBottom: 5,
  },
  instructionText: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  imageViewerContainer: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingVertical: 10,
  },
  fullImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    marginTop: (SCREEN_HEIGHT / 100) * 22,
  },
  imageViewerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    top: 50,
    left: 20,
    position: 'absolute',
    zIndex: 100,
    width: '90%',
  },
  closeButton: {
    backgroundColor: colors.black,
    borderRadius: 20,
    padding: 8,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  noTicketsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  ticketGraphic: {
    width: 200,
    height: 120,
    backgroundColor: colors.lightGrey,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  starsContainer: {
    flexDirection: 'row',
    marginTop: 5,
  },
  ticketNumbers: {
    position: 'absolute',
    left: 10,
    right: 10,
    top: 0,
    bottom: 0,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  noTicketsMessage: {
    marginBottom: 10,
    textAlign: 'center',
  },
  backToHomeButton: {
    backgroundColor: colors.darkBlue,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
    marginTop: 20,
  },
  ticketsContainer: {
    paddingHorizontal: 20,
  },
  ticketOption: {
    backgroundColor: colors.borderGrey,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.lightGrey,
    overflow: 'hidden',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  optionHeader: {
    backgroundColor: colors.darkBlue,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionTitleSection: {
    flex: 1,
  },
  ticketDetails: {
    padding: 16,
  },
  ticketTypeContainer: {
    marginBottom: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.lightGrey,
    backgroundColor: 'transparent',
    marginVertical: 4,
  },
  selectedTicketContainer: {
    borderColor: colors.mainDarkMode || '#DDBD6B',
    backgroundColor: 'transparent',
  },
  ticketTypeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGrey,
  },
  ticketTypeInfo: {
    flex: 1
  },
  ticketTypeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ticketInformation: {
    marginTop: 16,
  },
  ticketInfoTitle: {
    marginBottom: 12,
  },
  validityIcons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  validityIcon: {
    alignItems: 'center',
    flex: 1,
  },
  quantitySelector: {
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.lightGrey,
    borderRadius: 8,
  },
  quantityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  quantityLabel: {
    flex: 1,
  },
  inCartLabel: {
    marginLeft: 8,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.darkBlue,
    borderRadius: 6,
    padding: 4,
  },
  quantityButton: {
    backgroundColor: colors.darkBlue || '#1976D2',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
  },
  quantityDisplay: {
    minWidth: 40,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  addToCartButton: {
    backgroundColor: colors.darkBlue || '#1976D2',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 6,
  },
  tabContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  placeholderText: {
    textAlign: 'center',
  },
  infoTabContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  moreInfoButton: {
    backgroundColor: colors.red,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  infoSection: {
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGrey,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoTitle: {
    marginLeft: 8,
  },
  infoContent: {
    marginLeft: 24,
    lineHeight: 20,
  },
  dateButtonsContainer: {
    flexDirection: 'row',
    marginLeft: 24,
    gap: 10,
  },
  dateButton: {
    backgroundColor: colors.darkBlue,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    flex: 1,
    alignItems: 'center',
  },
  instructionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  instructionText: {
    textAlign: 'center',
    fontStyle: 'italic',
  },
  expandButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 9,
    borderRadius: 6,
    backgroundColor: colors.mainDarkMode,
    marginVertical: 16,
  },
  expandedContent: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.lightGrey,
    paddingHorizontal: 11
  },
  detailedInfo: {
    marginTop: 16,
  },
  infoDetailSection: {
    marginBottom: 16,
  },
  detailTitle: {
    marginBottom: 8,
  },
  detailItem: {
    marginBottom: 4,
    paddingLeft: 8,
  },
  pricingDetailsSection: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: colors.lightGrey,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.lightGrey,
  },
  pricingTitle: {
    marginBottom: 12,
    textAlign: 'center',
  },
  pricingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingVertical: 4,
  },
  pricingLabel: {
    flex: 1,
  },
  pricingValue: {
    flex: 1,
    textAlign: 'right',
  },
  availabilityStatusContainer: {
    marginTop: 8,
    padding: 8,
    backgroundColor: colors.lightGrey,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.lightGrey,
  },
  disabledButton: {
    opacity: 0.5,
  },
});

export default ProductDetails;
