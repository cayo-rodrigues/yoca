import * as yup from "yup";

const updateBillSchema = yup.object().shape({
  paid: yup.boolean().required("Field paid is required"),
});

export default updateBillSchema;
