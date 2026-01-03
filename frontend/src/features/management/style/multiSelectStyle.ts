import { type StylesConfig } from "react-select";
import { type GradeOption } from "../types/group";

export const selectStyle: StylesConfig<GradeOption, true> = {
  control: (base, state) => ({
    ...base,
    minHeight: "38px",
    height: "38px",
    borderColor: state.isFocused ? "rgb(56, 94, 164)" : "#c7c7c7",
    borderWidth: state.isFocused ? "2px" : "1px",
    boxShadow: "none",
    "&:hover": {
      borderColor: state.isFocused ? "rgb(56, 94, 164)" : "#a0a0a0",
    },
  }),

  valueContainer: (base) => ({
    ...base,
    height: "38px",
    padding: "0 6px",
  }),

  input: (base) => ({
    ...base,
    margin: 0,
    padding: 0,
  }),

  indicatorsContainer: (base) => ({
    ...base,
    height: "38px",
  }),
};
