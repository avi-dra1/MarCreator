// StockPickerLogic.js
import * as DocumentPicker from 'expo-document-picker';

export const pickStockIcon = async () => {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: 'image/*',
      copyToCacheDirectory: true,
    });

    if (result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      return { uri: asset.uri, name: asset.name };
    }
  } catch (err) {
    console.error('Error picking icon:', err);
  }
  return null;
};