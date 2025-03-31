import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  FlatList, 
  TextInput, 
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image
} from 'react-native';
import axios from 'axios';

const API_URL = 'http://192.168.230.205:2052/api/chatbot'; 

const ChatbotApp = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [answer, setAnswer] = useState(null);
  const [customMessage, setCustomMessage] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, text: 'Welcome to ShareMyRide! How can I help you today?', isUser: false }
  ]);
  const [loading, setLoading] = useState(true);
  const [inputMode, setInputMode] = useState('default'); // 'default', 'custom'
  const [showCategories, setShowCategories] = useState(true); // New state to control category visibility

  useEffect(() => {
    // Fetch categories when component mounts
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/chatbot`, {});
      if (response.data.categories) {
        setCategories(response.data.categories);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: 'Sorry, there was an error connecting to the server.',
        isUser: false
      }]);
      setLoading(false);
    }
  };

  const handleCategorySelect = async (category) => {
    setSelectedCategory(category);
    setSelectedQuestion(null);
    setAnswer(null);
    setInputMode('default');
    setShowCategories(false); // Hide categories after selection
    
    // Add user message
    setMessages(prev => [...prev, {
      id: Date.now(),
      text: `I'd like to know about ${category}`,
      isUser: true
    }]);
    
    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/chatbot`, { category });
      if (response.data.questions) {
        setQuestions(response.data.questions);
        
        // Add bot message with category selection
        setMessages(prev => [...prev, {
          id: Date.now(),
          text: `Here are some common questions about ${category}:`,
          isUser: false,
          isQuestionList: true,
          questions: response.data.questions
        }]);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching questions:', error);
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: 'Sorry, there was an error fetching questions for this category.',
        isUser: false
      }]);
      setLoading(false);
    }
  };

  const handleQuestionSelect = async (question) => {
    setSelectedQuestion(question);
    
    // Add user message
    setMessages(prev => [...prev, {
      id: Date.now(),
      text: question,
      isUser: true
    }]);
    
    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/chatbot`, {
        category: selectedCategory,
        question
      });
      
      if (response.data.answer) {
        setAnswer(response.data.answer);
        
        // Add bot message with answer
        setMessages(prev => [...prev, {
          id: Date.now(),
          text: response.data.answer,
          isUser: false
        }]);
      } else if (response.data.message) {
        // If no answer was found, show suggestion to send custom message
        setAnswer(null);
        setInputMode('custom');
        
        // Add bot message suggesting custom message
        setMessages(prev => [...prev, {
          id: Date.now(),
          text: response.data.message,
          isUser: false
        }]);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching answer:', error);
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: 'Sorry, there was an error getting the answer to your question.',
        isUser: false
      }]);
      setLoading(false);
    }
  };

  const handleCustomMessageSubmit = async () => {
    if (!customMessage.trim()) return;
    
    // Add user message
    setMessages(prev => [...prev, {
      id: Date.now(),
      text: customMessage,
      isUser: true
    }]);
    
    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/chatbot`, {
        category: selectedCategory || 'Custom Message',
        customMessage: customMessage
      });
      
      if (response.data.message) {
        // Add bot confirmation message
        setMessages(prev => [...prev, {
          id: Date.now(),
          text: response.data.message,
          isUser: false
        }]);
        
        // Reset input
        setCustomMessage('');
        setInputMode('default');
      }
      setLoading(false);
    } catch (error) {
      console.error('Error submitting custom message:', error);
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: 'Sorry, there was an error submitting your message.',
        isUser: false
      }]);
      setLoading(false);
    }
  };

  const resetChat = () => {
    setSelectedCategory(null);
    setQuestions([]);
    setSelectedQuestion(null);
    setAnswer(null);
    setCustomMessage('');
    setMessages([
      { id: 1, text: 'Welcome to ShareMyRide! How can I help you today?', isUser: false }
    ]);
    setInputMode('default');
    setShowCategories(true); // Show categories again when chat is reset
  };

  const renderMessage = ({ item }) => {
    if (item.isQuestionList) {
      return (
        <View style={[styles.messageContainer, !item.isUser && styles.botMessageContainer]}>
          <Text style={styles.messageText}>{item.text}</Text>
          {item.questions.map((q, index) => (
            <TouchableOpacity
              key={index}
              style={styles.questionButton}
              onPress={() => handleQuestionSelect(q)}
            >
              <Text style={styles.questionButtonText}>{q}</Text>
            </TouchableOpacity>
          ))}
        </View>
      );
    }
    
    return (
      <View style={[styles.messageContainer, item.isUser ? styles.userMessageContainer : styles.botMessageContainer]}>
        <Text style={styles.messageText}>{item.text}</Text>
      </View>
    );
  };

  // Render categories component - now this will be part of the main content, not the input area
  const renderCategoriesComponent = () => {
    if (showCategories && !selectedCategory && !loading) {
      return (
        <View style={styles.categoriesContainer}>
          {categories
            .filter(category => category !== "Custom Message") // Filter out "Custom Message"
            .map((category, index) => (
              <TouchableOpacity
                key={index}
                style={styles.categoryButton}
                onPress={() => handleCategorySelect(category)}
              >
                <Text style={styles.categoryButtonText}>{category}</Text>
              </TouchableOpacity>
            ))}
        </View>
      );
    }
    return null;
  };

  // Render greeting message with styling
  const renderGreeting = () => {
    if (showCategories && !selectedCategory) {
      return (
        <View style={styles.greetingContainer}>
          <Text style={styles.greetingText}>Welcome to ShareMyRide! How can I help you today?</Text>
        </View>
      );
    }
    return null;
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={styles.header}>
        <View style={styles.headerContent}>

        </View>
        <TouchableOpacity style={styles.resetButton} onPress={resetChat}>
          <Text style={styles.resetButtonText}>New Chat</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.contentContainer}>
        {/* Render greeting at the top */}
        {renderGreeting()}
        
        {/* Render categories just below the greeting */}
        {renderCategoriesComponent()}
        
        {/* FlatList for chat messages */}
        <FlatList
          data={messages.slice(1)} // Skip the first greeting since we now show it separately
          renderItem={renderMessage}
          keyExtractor={item => item.id.toString()}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesList}
        />
      </View>
      
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF9500" />
        </View>
      )}
      
      <View style={styles.inputContainer}>
        {!showCategories && (
          inputMode === 'custom' ? (
            <View style={styles.customMessageContainer}>
              <TextInput
                style={styles.customMessageInput}
                placeholder="Type your question here..."
                value={customMessage}
                onChangeText={setCustomMessage}
                multiline
              />
              <TouchableOpacity
                style={styles.sendButton}
                onPress={handleCustomMessageSubmit}
                disabled={!customMessage.trim()}
              >
                <Text style={styles.sendButtonText}>Send</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.askMoreButton}
              onPress={() => setInputMode('custom')}
            >
              <Text style={styles.askMoreButtonText}>Ask another question</Text>
            </TouchableOpacity>
          )
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#f97316',
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  greetingContainer: {
    backgroundColor: '#FFF8E1',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
    marginBottom:40,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9500',
  },
  greetingText: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
  },
  categoriesContainer: {
    marginTop: 16,
    marginBottom: 16,
  },
  resetButton: {
    padding: 8,
  },
  resetButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesList: {
    paddingVertical: 16,
  },
  messageContainer: {
    padding: 12,
    borderRadius: 20,
    marginBottom: 12,
    maxWidth: '80%',
  },
  userMessageContainer: {
    backgroundColor: '#f97316',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 0,
  },
  botMessageContainer: {
    backgroundColor: 'white',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 0,
  },
  messageText: {
    fontSize: 16,
    color: '#333',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  inputContainer: {
    padding: 12,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  categoryButton: {
    backgroundColor: '#f97316',
    paddingVertical: 15,
    paddingHorizontal: 14,
    borderRadius: 16,
    marginLeft:80,
    marginTop:15,
    marginBottom: 10, // Reduced spacing between category buttons
    alignSelf: 'stretch', // Make buttons stretch horizontally
  },
  categoryButtonText: {
    color: 'white',
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 14,
  },
  questionButton: {
    backgroundColor: '#F0F0F0',
    padding: 10,
    borderRadius: 16,
    marginTop: 8,
  },
  questionButtonText: {
    color: '#333',
  },
  customMessageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  customMessageInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 100,
    backgroundColor: 'white',
  },
  sendButton: {
    backgroundColor: '#f97316',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginLeft: 8,
  },
  sendButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  askMoreButton: {
    backgroundColor: '#f97316',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: 'center',
  },
  askMoreButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});

export default ChatbotApp;