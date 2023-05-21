import React, { useReducer } from "react";
import PageWrapper from "./components/PageWrapper";
import CompensationItem, { Compensation } from "./components/CompensationItem";
import CompensationItemForm from "./components/CompensationItemForm";
import { CompensationChart } from "./components/CompensationChart";

interface State {
  compensationItems: Compensation[];
  nextId: number;
}

type Action =
  | { type: "ADD_ITEM"; payload: Omit<Compensation, "id"> }
  | { type: "UPDATE_ITEM"; payload: Compensation }
  | { type: "DELETE_ITEM"; payload: number };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_ITEM":
      return {
        ...state,
        compensationItems: [
          ...state.compensationItems,
          { ...action.payload, id: state.nextId },
        ],
        nextId: state.nextId + 1,
      };
    case "UPDATE_ITEM":
      return {
        ...state,
        compensationItems: state.compensationItems.map((item) =>
          item.id === action.payload.id ? action.payload : item
        ),
      };
    case "DELETE_ITEM":
      return {
        ...state,
        compensationItems: state.compensationItems.filter(
          (item) => item.id !== action.payload
        ),
      };
    default:
      return state;
  }
};

const App: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, {
    compensationItems: [],
    nextId: 0,
  });

  return (
    <PageWrapper>
      <CompensationChart compensationItems={state.compensationItems} />
      <CompensationItemForm
        onCreate={(newItem) => dispatch({ type: "ADD_ITEM", payload: newItem })}
      />
      <div className="space-y-4">
        {state.compensationItems.map((item) => (
          <CompensationItem
            key={item.id}
            item={item}
            onUpdate={(updatedItem) =>
              dispatch({ type: "UPDATE_ITEM", payload: updatedItem })
            }
            onDelete={() => dispatch({ type: "DELETE_ITEM", payload: item.id })}
          />
        ))}
      </div>
    </PageWrapper>
  );
};

export default App;
