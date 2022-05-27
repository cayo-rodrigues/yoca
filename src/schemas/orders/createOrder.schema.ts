import * as yup from "yup";
import { MAX_BIGINT, MAX_INT } from "../../utils";

const createOrderSchema = yup.object().shape({
  billId: yup
    .number()
    .max(MAX_BIGINT, `Field billId cannot be longer than ${MAX_BIGINT}`)
    .integer("Field billId must be an integer")
    .required("billId field is required"),
  employeeId: yup
    .string()
    .uuid("Field employeeId must have a valid UUID")
    .required("Field employeeId is required"),
  table: yup
    .string()
    .matches(/^([0-9])+$/, "Field table must be a positive number")
    .required("Field table is required"),
  ordersProducts: yup
    .array()
    .of(
      yup.object().shape({
        quantity: yup
          .number()
          .max(MAX_INT, `Field quantity cannot be longer than ${MAX_INT}`)
          .integer("Field quantity must be an integer")
          .positive("Field quantity must be a positive number"),
        productId: yup
          .string()
          .uuid("Field productId must have a valid UUID")
          .required("Field productId is required"),
      })
    )
    .required("Field ordersProducts is required"),
});

export default createOrderSchema;
