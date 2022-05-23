import * as yup from "yup";

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
              quantity: yup.number().integer("quantity field is an integer"),
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
