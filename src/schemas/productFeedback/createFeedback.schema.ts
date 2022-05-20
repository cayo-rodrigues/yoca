import * as yup from "yup";

const createProductFeedbackSchema = {
  schema: {
    user: {
      yupSchema: yup.object().shape({
        id: yup.string().uuid("Invalid uuid").required("Field id is required"),
      }),
    },
    body: {
      yupSchema: yup.object().shape({
        description: yup.string().required("Field description is required"),
        rating: yup
          .number()
          .min(1, "Field rating must be between 1 and 5 inclusive")
          .max(5, "Field rating must be between 1 and 5 inclusive")
          .required("Field rating is required"),
        product: yup
          .string()
          .uuid("Invalid uuid")
          .required("Field id_product is required"),
      }),
    },
  },
};

export default createProductFeedbackSchema;
