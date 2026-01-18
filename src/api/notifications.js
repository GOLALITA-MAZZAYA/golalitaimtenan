import axios from "axios";

export const convertAPNtoFCM = async (token) => {
  const res = await axios.post(
    "https://iid.googleapis.com/iid/v1:batchImport",
    {
      application: "com.golalita.ios",
      sandbox: false,
      apns_tokens: [token],
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "key=AAAA94TCSr0:APA91bEecpJPtQgKQEIrHHIbE9-SerkPFhBZ_RrGg0VT1iqHiO31N8ZBNlxIy01_Xy9zD_2sIkiqX6Qt8FHJrYrsIC9KKhQVURVoZDMMaACzEY770iRnC_A3eas2V8j-CzkWsta6QN03",
      },
    }
  );

  return res.data?.results?.[0]?.registration_token;
};
