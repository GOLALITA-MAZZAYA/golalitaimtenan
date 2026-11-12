import React, { useEffect, useRef, useState } from 'react';
import {
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Header from '../../components/Header';
import { TypographyText } from '../../components/Typography';
import { colors } from '../../components/colors';
import { BALOO_REGULAR } from '../../redux/types';
import { useTheme } from '../../components/ThemeProvider';
import { sized } from '../../Svg';
import SendSvg from '../../assets/send.svg';
import DeleteSvg from '../../assets/delete.svg';
import { isRTL } from '../../../utils';
import {
  clearAiChatHistory,
  getAiChatHistory,
  localizedIntroField,
  sendAiChatMessage,
} from '../../redux/aiChat/aiChat-thunks';

const AiChat = () => {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const dispatch = useDispatch();
  const listRef = useRef(null);
  const [draft, setDraft] = useState('');
  const [androidKeyboardHeight, setAndroidKeyboardHeight] = useState(0);

  const { messages, intro, historyLoading, sending } = useSelector(
    (state) => state.aiChatReducer
  );

  useEffect(() => {
    dispatch(getAiChatHistory());
  }, [dispatch]);

  useEffect(() => {
    if (Platform.OS !== 'android') return undefined;

    const showSub = Keyboard.addListener('keyboardDidShow', (e) => {
      setAndroidKeyboardHeight(e.endCoordinates?.height ?? 0);
    });
    const hideSub = Keyboard.addListener('keyboardDidHide', () => {
      setAndroidKeyboardHeight(0);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const DeleteIcon = sized(DeleteSvg, 20, 20, colors.red);
  const SendIcon = sized(
    SendSvg,
    20,
    20,
    isDark ? colors.mainDarkMode : colors.darkBlue
  );

  const handleSend = () => {
    if (!draft.trim() || sending) return;
    dispatch(sendAiChatMessage(draft));
    setDraft('');
  };

  const renderMessage = ({ item }) => {
    const isUser = item.role === 'user';
    // LTR: user on the right, assistant on the left. Arabic mirrors that, in
    // line with the already-mirrored input row. The small "tail" corner
    // follows whichever side the bubble sits on.
    const onRight = isUser !== isRTL();

    return (
      <View
        style={[
          styles.bubbleRow,
          { justifyContent: onRight ? 'flex-end' : 'flex-start' },
        ]}
      >
        <View
          style={[
            styles.bubble,
            {
              backgroundColor: isUser
                ? isDark
                  ? colors.mainDarkMode
                  : colors.darkBlue
                : isDark
                  ? colors.cardBackground
                  : colors.highlatedGrey,
              borderBottomRightRadius: onRight ? 4 : 16,
              borderBottomLeftRadius: onRight ? 16 : 4,
            },
          ]}
        >
          <TypographyText
            title={item.text}
            font={BALOO_REGULAR}
            size={15}
            textColor={
              isUser
                ? isDark
                  ? colors.mainDarkModeText
                  : colors.white
                : isDark
                  ? colors.white
                  : colors.black
            }
          />
        </View>
      </View>
    );
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: isDark ? colors.darkBlue : colors.white,
      }}
    >
      {/* Title and app name come from GET /ai/customer-chat/intro; the locale
          strings only cover the moment before it loads or a failed request. */}
      <Header
        label={localizedIntroField(intro, 'title') || t('AiChat.title')}
        subLabel={localizedIntroField(intro, 'app_name') || t('AiChat.appName')}
        align="left"
        btns={['back']}
        rightChildren={
          messages.filter((m) => !m.isIntro).length > 0 ? (
            <TouchableOpacity onPress={() => dispatch(clearAiChatHistory())}>
              <DeleteIcon />
            </TouchableOpacity>
          ) : null
        }
      />

      <KeyboardAvoidingView
        style={[
          styles.keyboardAvoider,
          Platform.OS === 'android' && { paddingBottom: androidKeyboardHeight },
        ]}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {/* Render FlatList immediately to avoid screen freezing */}
        <FlatList
          ref={listRef}
          style={styles.list}
          data={messages}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderMessage}
          contentContainerStyle={styles.listContent}
          onContentSizeChange={() =>
            listRef.current?.scrollToEnd({ animated: true })
          }
          ListHeaderComponent={
            historyLoading ? (
              <View style={styles.topLoader}>
                <ActivityIndicator
                  size="small"
                  color={isDark ? colors.mainDarkMode : colors.darkBlue}
                />
              </View>
            ) : null
          }
          ListFooterComponent={
            sending ? (
              <View
                style={[
                  styles.bubbleRow,
                  { justifyContent: isRTL() ? 'flex-end' : 'flex-start' },
                ]}
              >
                <View
                  style={[
                    styles.bubble,
                    isRTL()
                      ? { borderBottomRightRadius: 4 }
                      : { borderBottomLeftRadius: 4 },
                    {
                      backgroundColor: isDark
                        ? colors.cardBackground
                        : colors.highlatedGrey,
                      flexDirection: isRTL() ? 'row-reverse' : 'row',
                      alignItems: 'center',
                      gap: 8,
                    },
                  ]}
                >
                  <ActivityIndicator
                    size="small"
                    color={isDark ? colors.mainDarkMode : colors.darkBlue}
                  />
                  <TypographyText
                    title={t('AiChat.typing')}
                    font={BALOO_REGULAR}
                    size={15}
                    textColor={isDark ? colors.secondary : colors.darkGrey}
                  />
                </View>
              </View>
            ) : null
          }
        />

        <View
          style={[
            styles.inputRow,
            { flexDirection: isRTL() ? 'row-reverse' : 'row' },
          ]}
        >
          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder={t('AiChat.inputPlaceholder')}
            placeholderTextColor={colors.darkGrey}
            style={[
              styles.input,
              {
                color: isDark ? colors.white : colors.black,
                backgroundColor: isDark
                  ? colors.cardBackground
                  : colors.highlatedGrey,
                textAlign: isRTL() ? 'right' : 'left',
              },
            ]}
            multiline
            maxLength={1000}
          />
          <TouchableOpacity
            onPress={handleSend}
            disabled={sending || !draft.trim()}
            style={[
              styles.sendBtn,
              { opacity: sending || !draft.trim() ? 0.5 : 1 },
            ]}
          >
            <SendIcon />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  keyboardAvoider: {
    flex: 1,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexGrow: 1,
  },
  topLoader: {
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bubbleRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  bubble: {
    maxWidth: '78%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
  },
  emptyWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingTop: 80,
  },
  inputRow: {
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 30,
    gap: 10,
  },
  input: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 100,
    fontFamily: BALOO_REGULAR,
    fontSize: 15,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default AiChat;
