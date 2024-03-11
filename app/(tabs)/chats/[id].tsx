import { ImageBackground, StyleSheet, Text, View, Image } from 'react-native';
import messageData from '@assets/data/messages.json';
import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
    Bubble,
    GiftedChat,
    IMessage,
    InputToolbar,
    Send,
    SystemMessage,
} from 'react-native-gifted-chat';
import patternImage from '@assets/images/pattern.png';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '@constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { Swipeable } from 'react-native-gesture-handler';
import ChatMessageBox from '@components/ChatMessageBox';
import ReplyMessageBar from '@components/ReplyMessageBar';

const imageUri = Image.resolveAssetSource(patternImage).uri;

const Chat = () => {
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [text, setText] = useState('');
    const insets = useSafeAreaInsets();
    const swipeableRowRef = useRef<Swipeable | null>(null);
    const [replyMessage, setReplyMessage] = useState<IMessage | null>(null);

    const updateRowRef = useCallback(
        (ref: any) => {
            if (
                ref &&
                replyMessage &&
                ref.props.children.props.currentMessage._id === replyMessage._id
            ) {
                swipeableRowRef.current = ref;
            }
        },
        [replyMessage],
    );

    useEffect(() => {
        setMessages([
            ...messageData.map((message) => ({
                _id: message.id,
                text: message.msg,
                createdAt: new Date(message.date),
                user: {
                    _id: message.from,
                    name: message.from ? 'You' : 'Bob',
                },
            })),
        ]);
    }, []);

    const onSend = useCallback((messages = []) => {
        setMessages((previousMessages) =>
            GiftedChat.append(previousMessages, messages),
        );
    }, []);

    useEffect(() => {
        if (replyMessage && swipeableRowRef.current) {
            swipeableRowRef.current.close();
            swipeableRowRef.current = null;
        }
    }, [replyMessage]);

    return (
        <ImageBackground
            source={{ uri: imageUri }}
            style={{
                flex: 1,
                marginBottom: insets.bottom,
                // bottom: 0,
                backgroundColor: Colors.background,
            }}
        >
            <GiftedChat
                messages={messages}
                onSend={(messages: any) => onSend(messages)}
                user={{
                    _id: 1,
                }}
                onInputTextChanged={setText}
                renderSystemMessage={(props) => {
                    return (
                        <SystemMessage
                            {...props}
                            textStyle={{ color: Colors.gray }}
                        />
                    );
                }}
                renderBubble={(props) => {
                    return (
                        <Bubble
                            {...props}
                            textStyle={{
                                right: {
                                    color: '#000',
                                },
                            }}
                            wrapperStyle={{
                                right: { backgroundColor: Colors.lightGreen },
                                left: {
                                    backgroundColor: '#fff',
                                },
                            }}
                        />
                    );
                }}
                renderAvatar={null}
                maxComposerHeight={100}
                bottomOffset={insets.bottom}
                renderSend={(props) => {
                    return (
                        <View
                            style={{
                                flexDirection: 'row',
                                height: 44,
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 14,
                                paddingHorizontal: 14,
                            }}
                        >
                            {text.length > 0 && (
                                <Send
                                    {...props}
                                    containerStyle={{
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Ionicons
                                        name='send'
                                        color={Colors.primary}
                                        size={28}
                                    />
                                </Send>
                            )}
                            {text.length === 0 && (
                                <>
                                    <Ionicons
                                        name='camera-outline'
                                        color={Colors.primary}
                                        size={28}
                                    />
                                    <Ionicons
                                        name='mic-outline'
                                        color={Colors.primary}
                                        size={28}
                                    />
                                </>
                            )}
                        </View>
                    );
                }}
                renderInputToolbar={(props) => {
                    return (
                        <InputToolbar
                            {...props}
                            containerStyle={{
                                backgroundColor: Colors.background,
                            }}
                            renderActions={() => (
                                <View
                                    style={{
                                        height: 44,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        left: 10,
                                    }}
                                >
                                    <Ionicons
                                        name='add'
                                        color={Colors.primary}
                                        size={28}
                                    />
                                </View>
                            )}
                        />
                    );
                }}
                textInputProps={styles.composer}
                renderMessage={(props) => (
                    <ChatMessageBox
                        {...props}
                        updateRowRef={updateRowRef}
                        setReplyOnSwipeOpen={setReplyMessage}
                    />
                )}
                renderChatFooter={() => {
                    return (
                        <ReplyMessageBar
                            clearReply={() => setReplyMessage(null)}
                            message={replyMessage}
                        />
                    );
                }}
            />
        </ImageBackground>
    );
};

export default Chat;

const styles = StyleSheet.create({
    composer: {
        backgroundColor: '#fff',
        borderRadius: 15,
        borderWidth: 1,
        borderColor: Colors.lightGray,
        paddingHorizontal: 10,
        fontSize: 16,
        marginVertical: 4,
        paddingTop: 8,
    },
});
