import * as yup from "yup";

const createGeneralFeedbackSchema = {
  schema: {
    user: {
      yupSchema: yup.object().shape({
        id: yup.string().uuid().required(),
      }),
    },
    body: {
      yupSchema: yup.object().shape({
        description: yup.string().required(),
        rating: yup.number().min(1).max(5).required(),
      }),
    },
  },
};

export default createGeneralFeedbackSchema;
