import * as yup from "yup";

const createProductFeedbackSchema = yup.object().shape({
  description: yup.string().required("Field description is required"),
  rating: yup
    .number()
    .min(0, "Field rating must be between 0 and 5 inclusive")
    .max(5, "Field rating must be between 0 and 5 inclusive")
    .required("Field rating is required"),
  productId: yup
    .string()
    .uuid("Field productId must have a valid UUID")
    .required("Field productId is required"),
});

export default createProductFeedbackSchema;
