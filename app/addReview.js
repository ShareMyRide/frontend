import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const AddReview = ({ appName }) => {
  const [rating, setRating] = useState(0);
  const [showRatingModal, setShowRatingModal] = useState(true);
  const [showThankYouModal, setShowThankYouModal] = useState(false);

  const navigation = useNavigation(); // Get navigation object

  const handleRating = (selectedRating) => {
    setRating(selectedRating);
  };

  const handleSubmit = () => {
    setShowRatingModal(false);
    setShowThankYouModal(true);
  };

  const handleCancel = () => {
    setShowRatingModal(false);
  };

  const handleOk = () => {
    setShowThankYouModal(false);
    navigation.navigate('Review'); // Navigate to the Review page
  };

  const handleWriteReview = () => {
    setShowThankYouModal(false);
    navigation.navigate('Review'); // Navigate when "Write a Review" is clicked
  };

  return (
    <View>
      <Modal
        transparent={true}
        visible={showRatingModal}
        animationType="fade"
        onRequestClose={handleCancel}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.title}>Enjoying {appName}?</Text>
            <Text style={styles.subtitle}>Tap a star to rate it.</Text>

            <View style={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity key={star} onPress={() => handleRating(star)} style={styles.starButton}>
                  <AntDesign name={star <= rating ? 'star' : 'staro'} size={40} color="#007AFF" />
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={handleCancel}>
                <Text style={styles.buttonTextBlue}>Cancel</Text>
              </TouchableOpacity>
              <View style={styles.buttonDivider} />
              <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={rating === 0}>
                <Text style={[styles.buttonTextBlue, rating === 0 && styles.buttonDisabled]}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        transparent={true}
        visible={showThankYouModal}
        animationType="fade"
        onRequestClose={handleOk}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.title}>Thanks for your feedback.</Text>
            <Text style={styles.subtitle}>You can also write a review.</Text>

            <View style={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <View key={star} style={styles.starButton}>
                  <AntDesign name="star" size={40} color="#FFD700" />
                </View>
              ))}
            </View>

            <TouchableOpacity style={styles.reviewButton} onPress={handleWriteReview}>
              <Text style={styles.buttonTextBlue}>Write a Review</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.okButton} onPress={handleOk}>
              <Text style={styles.buttonTextBlue}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 20,
  },
  starButton: {
    padding: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  button: {
    flex: 1,
    padding: 15,
    alignItems: 'center',
  },
  buttonDivider: {
    width: 1,
    backgroundColor: '#E0E0E0',
  },
  buttonTextBlue: {
    color: '#007AFF',
    fontSize: 18,
    fontWeight: '500',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  reviewButton: {
    alignItems: 'center',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  okButton: {
    alignItems: 'center',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
});

export default AddReview;
