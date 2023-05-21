import React, { useReducer, ChangeEvent } from "react";
import { Compensation } from "./CompensationItem";

interface State extends Omit<Compensation, "id"> {}

type Action =
  | { type: "SET_TYPE"; payload: State["type"] }
  | { type: "SET_AMOUNT"; payload: State["amount"] }
  | { type: "SET_STARTDATE"; payload: State["startDate"] };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_TYPE":
      return { ...state, type: action.payload };
    case "SET_AMOUNT":
      return { ...state, amount: action.payload };
    case "SET_STARTDATE":
      return { ...state, startDate: action.payload };
    default:
      return state;
  }
};

interface Props {
  onCreate: (newItem: Omit<Compensation, "id">) => void;
}

const CompensationItemForm: React.FC<Props> = ({ onCreate }) => {
  const [state, dispatch] = useReducer(reducer, {
    type: "one-time",
    amount: 0,
    startDate: new Date(),
  });

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    switch (e.target.name) {
      case "type":
        dispatch({ type: "SET_TYPE", payload: e.target.value as any });
        break;
      case "amount":
        dispatch({ type: "SET_AMOUNT", payload: Number(e.target.value) });
        break;
      case "startDate":
        dispatch({ type: "SET_STARTDATE", payload: new Date(e.target.value) });
        break;
      default:
        break;
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onCreate(state);
    dispatch({ type: "SET_TYPE", payload: "one-time" });
    dispatch({ type: "SET_AMOUNT", payload: 0 });
    dispatch({ type: "SET_STARTDATE", payload: new Date() });
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white border shadow-md">
      <div>
        <select
          name="type"
          value={state.type}
          onChange={handleInputChange}
          className="select select-bordered w-full max-w-xs"
        >
          <option value="one-time">One-time</option>
          <option value="quarterly">Quarterly</option>
          <option value="annually">Annually</option>
          <option value="monthly">Monthly</option>
        </select>
        <input
          name="amount"
          value={state.amount}
          onChange={handleInputChange}
          type="number"
          className="input input-bordered"
        />
        <input
          name="startDate"
          value={state.startDate.toISOString().substring(0, 10)}
          onChange={handleInputChange}
          type="date"
          className="input input-bordered"
        />
      </div>
      <button type="submit" className="btn btn-blue mt-2">
        Add Compensation Item
      </button>
    </form>
  );
};

export default CompensationItemForm;
