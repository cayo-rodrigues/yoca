import * as yup from "yup";

const createGeneralFeedbackSchema = yup.object().shape({
  description: yup.string().required("Field description is required"),
  rating: yup
    .number()
    .min(1, "Field rating must be between 1 and 5 inclusive")
    .max(5, "Field rating must be between 1 and 5 inclusive")
    .required("Field rating is required"),
});
export default createGeneralFeedbackSchema;
