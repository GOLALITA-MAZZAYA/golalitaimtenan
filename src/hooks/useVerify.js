import { useState } from "react";
import { showMessage } from "react-native-flash-message";

export const useVerify = (validate_code, t) => {
  const [generatedCode, setGeneratedCode] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [type, setType] = useState(null);

  const generateRandomCode = (type, value) => {
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    setGeneratedCode(randomCode);

    const payload = {
      params: {
        [type]: value,
        validate_code: randomCode,
        method: type,
      },
    };
    validate_code(payload, t);
    setModalVisible(true);
    setType(type);
    console.log("Generated Code:", randomCode);
  };

  const verifyHandler = async (validationSchema, values, type) => {
    try {
      await validationSchema.fields[type].validate(values[type]);
      !isModalVisible && generateRandomCode(type, values[type]);
    } catch (error) {
      showMessage({
        message: error.message,
        type: "danger",
      });
      console.error(`${type} validation error:`, error.message);
    }
  };

  return {
    generatedCode,
    isModalVisible,
    setModalVisible,
    type,
    verifyHandler,
  };
};
