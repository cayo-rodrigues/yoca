import * as yup from "yup";

const updateOrderSchema = yup.object().shape({
  status: yup
    .string()
    .oneOf(
      ["pending", "ready", "served"],
      'Field status must be "pending", "ready" or "served"'
    )
    .required("Field status is required"),
});

export default updateOrderSchema;
