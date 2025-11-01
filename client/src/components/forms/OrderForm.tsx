import React from "react";
import { useForm, useFieldArray, Controller, useWatch } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";

import { CommonForm } from "./CommonForm";
import type { Field } from "../../types/form";
import type { Order, Product, User } from "../../types";

type OrderStatus = Order["status"];

interface OrderFormProps {
  order?: Order | null;
  users: User[];
  products: Product[];
  isSubmitting?: boolean;
  onSubmit: (formData: any) => Promise<void> | void;
  onCancel: () => void;
}

type OrderFormValues = {
  userId: string;
  status: OrderStatus;
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
};

const statusOptions: { label: string; value: OrderStatus }[] = [
  { label: "Pending", value: "pending" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Delivered", value: "delivered" },
  { label: "Cancelled", value: "cancelled" },
];

const OrderForm = ({
  order,
  users,
  products,
  isSubmitting = false,
  onSubmit,
  onCancel,
}: OrderFormProps) => {
  const productsMap = React.useMemo(() => {
    const map = new Map<string, Product>();
    products?.forEach((product) => {
      map.set(product._id, product);
    });
    return map;
  }, [products]);

  const createDefaultItems = React.useCallback(() => {
    if (order?.items && order.items.length > 0) {
      return order.items.map((item) => ({
        productId:
          typeof item.product === "string"
            ? item.product
            : item.product?._id || "",
        quantity: item.quantity,
        price:
          item.price !== undefined
            ? item.price
            : typeof item.product !== "string"
              ? item.product?.price || 0
              : 0,
      }));
    }
    return [
      {
        productId: "",
        quantity: 1,
        price: 0,
      },
    ];
  }, [order]);

  const defaultValues = React.useMemo<OrderFormValues>(
    () => ({
      userId:
        typeof order?.user === "string"
          ? order?.user || ""
          : order?.user?._id || "",
      status: order?.status || "pending",
      items: createDefaultItems(),
    }),
    [order, createDefaultItems]
  );

  const form = useForm<OrderFormValues>({
    defaultValues,
    values: defaultValues,
  });

  const {
    control,
    setValue,
    reset,
    formState: { errors },
  } = form;

  React.useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const {
    fields: itemFields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "items",
  });

  const watchedItems = useWatch({ control, name: "items" });
  const itemsArray = React.useMemo(() => watchedItems || [], [watchedItems]);

  const totalAmount = React.useMemo(() => {
    return itemsArray.reduce((sum, item) => {
      const quantity = Number(item?.quantity) || 0;
      const price = Number(item?.price) || 0;
      return sum + quantity * price;
    }, 0);
  }, [itemsArray]);

  const userOptions = React.useMemo(
    () =>
      users.map((user) => ({
        label: `${user.name} (${user.email})`,
        value: user._id,
      })),
    [users]
  );

  const handleProductSelection = React.useCallback(
    (index: number, productId: string) => {
      const product = productsMap.get(productId);
      setValue(`items.${index}.price`, product?.price || 0, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
      const currentQuantity =
        itemsArray?.[index]?.quantity && itemsArray[index].quantity > 0
          ? itemsArray[index].quantity
          : 1;
      setValue(`items.${index}.quantity`, currentQuantity, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
    },
    [productsMap, setValue, itemsArray]
  );

  const handleQuantityChange = React.useCallback(
    (index: number, nextValue: number) => {
      const quantity = Number.isNaN(nextValue) ? 1 : Math.max(1, nextValue);
      setValue(`items.${index}.quantity`, quantity, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
    },
    [setValue]
  );

  const addItem = () => {
    append({ productId: "", quantity: 1, price: 0 });
  };

  const removeItem = (index: number) => {
    if (itemFields.length === 1) return;
    remove(index);
  };

  const fields: Field[] = [
    {
      name: "userId",
      label: "Customer",
      type: "select",
      options: userOptions,
      validate: {
        required: "Customer is required",
      },
      placeholder: "Select a customer",
      isVertical: true,
      disabled: isSubmitting,
    },
    {
      name: "status",
      label: "Order Status",
      type: "select",
      options: statusOptions,
      isVertical: true,
      disabled: isSubmitting,
    },
    {
      name: "items",
      label: "Order Items",
      type: "addChildren",
      isVertical: true,
      addChildren: (
        <div className="space-y-4">
          {itemFields.map((item, index) => {
            const itemError =
              (errors.items && Array.isArray(errors.items)
                ? errors.items[index]
                : undefined) || ({} as any);
            const selectedProductId = itemsArray?.[index]?.productId || "";
            const quantityValue = itemsArray?.[index]?.quantity || 1;
            const priceValue = itemsArray?.[index]?.price || 0;
            const lineTotal = quantityValue * priceValue;

            return (
              <div
                key={item.id}
                className="relative border border-gray-200 rounded-lg p-4 bg-gray-50"
              >
                {itemFields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="absolute top-3 right-3 text-red-500 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-200 rounded-full p-1"
                    disabled={isSubmitting}
                  >
                    <Trash2 size={16} />
                  </button>
                )}

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                  <div className="md:col-span-5">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product
                    </label>
                    <Controller
                      control={control}
                      name={`items.${index}.productId` as const}
                      rules={{ required: "Product is required" }}
                      render={({ field }) => (
                        <select
                          {...field}
                          onChange={(event) => {
                            const value = event.target.value;
                            field.onChange(value);
                            handleProductSelection(index, value);
                          }}
                          value={selectedProductId}
                          className="input-field"
                          disabled={isSubmitting}
                        >
                          <option value="">Select product</option>
                          {products.map((product) => (
                            <option key={product._id} value={product._id}>
                              {product.name} (${product.price.toFixed(2)})
                            </option>
                          ))}
                        </select>
                      )}
                    />
                    {itemError?.productId && (
                      <p className="text-xs text-red-500 mt-1">
                        {itemError.productId.message}
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantity
                    </label>
                    <Controller
                      control={control}
                      name={`items.${index}.quantity` as const}
                      rules={{
                        required: "Quantity is required",
                        min: {
                          value: 1,
                          message: "Quantity must be at least 1",
                        },
                      }}
                      render={({ field }) => (
                        <input
                          type="number"
                          min={1}
                          {...field}
                          value={quantityValue}
                          className="input-field"
                          disabled={isSubmitting}
                          onChange={(event) => {
                            const value = Number(event.target.value);
                            field.onChange(value);
                            handleQuantityChange(index, value);
                          }}
                        />
                      )}
                    />
                    {itemError?.quantity && (
                      <p className="text-xs text-red-500 mt-1">
                        {itemError.quantity.message}
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price
                    </label>
                    <div className="input-field bg-gray-100">
                      ${priceValue.toFixed(2)}
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Line Total
                    </label>
                    <div className="input-field bg-gray-100">
                      ${lineTotal.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={addItem}
              className="btn-tertiary flex items-center gap-2"
              disabled={isSubmitting}
            >
              <Plus size={16} />
              Add Item
            </button>

            <div className="ml-auto text-right">
              <p className="text-sm text-gray-500">Order Total</p>
              <p className="text-2xl font-bold text-primary-600">
                ${totalAmount.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const formatData = (values: OrderFormValues) => {
    const items = values.items
      .filter((item) => item.productId)
      .map((item) => {
        const product = productsMap.get(item.productId);
        const price = item.price || product?.price || 0;

        return {
          product: item.productId,
          quantity: Math.max(1, Number(item.quantity) || 1),
          price,
        };
      });

    return {
      user: values.userId,
      status: values.status,
      items,
      totalAmount: items.reduce(
        (sum, item) => sum + item.quantity * (item.price || 0),
        0
      ),
    };
  };

  return (
    <CommonForm
      fields={fields}
      form={form}
      submitButtonLabel={order ? "Update Order" : "Create Order"}
      formatData={formatData}
      onFinish={async (payload) => {
        await onSubmit(payload);
      }}
      isLoading={isSubmitting}
      footerActions={
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="btn-secondary px-6 py-2.5"
        >
          Cancel
        </button>
      }
    />
  );
};

export default OrderForm;
