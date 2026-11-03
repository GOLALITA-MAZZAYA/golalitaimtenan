import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import CategoriesFilter from "../../../../MainScreen/components/Categories/CategoriesFilter";
import { useFormikContext } from "formik";
import { setCategoriesType } from "../../../../../redux/merchant/merchant-actions";
import { getParentCategories } from "../../../../../redux/merchant/merchant-thunks";
import { getFlexDirection } from "../../../../../../utils";

const CategoriesTypes = () => {
  const dispatch = useDispatch();
  const context = useFormikContext();
  const { categoriesType } = useSelector((state) => state.merchantReducer);
  const isFirstMount = useRef(true);

  useEffect(() => {
    if (categoriesType && !isFirstMount.current) {
      context.setFieldValue("category_id", []);
      dispatch(getParentCategories(categoriesType));
    }
    isFirstMount.current = false;
  }, [categoriesType]);

  const handleChange = (type) => {
    dispatch(setCategoriesType(type));
  };

  return (
    <CategoriesFilter
      type={categoriesType}
      onChange={handleChange}
      style={{ marginTop: 30, marginBottom: 15, ...getFlexDirection() }}
    />
  );
};

export default CategoriesTypes;
