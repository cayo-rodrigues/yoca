import * as yup from "yup";
import { MAX_INT } from "../../utils";

const createOrderSchema = {
  schema: {
    body: {
      yupSchema: yup.object().shape({
        billId: yup.number().required("billId field is required"),
        employeeId: yup
          .string()
          .uuid("invalid id")
          .required("employeeId field is required"),
        table: yup.string().required("table field is required"),
        ordersProducts: yup
          .array()
          .of(
            yup.object().shape({
              quantity: yup
                .number()
                .max(MAX_INT, "quantity field can't be so huge")
                .integer("quantity field is an integer")
                .positive("quantity field can't be negative"),
              productId: yup
                .string()
                .uuid("invalid id")
                .required("productId field is required"),
            })
          )
          .required("ordersProducts field is required"),
      }),
      validateOptions: {
        abortEarly: false,
      },
    },
  },
};

export default createOrderSchema;
