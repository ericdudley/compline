import React, { ChangeEvent, useState } from "react";

export type CompensationType = "one-time" | "quarterly" | "annually" | "monthly";

export interface Compensation {
  id: number;
  type: CompensationType;
  amount: number;
  startDate: Date;
}

interface Props {
  item: Compensation;
  onUpdate: (updatedItem: Compensation) => void;
  onDelete: () => void;
}

const CompensationItem: React.FC<Props> = ({ item, onUpdate, onDelete }) => {
  const [editMode, setEditMode] = useState(false);
  const [editedItem, setEditedItem] = useState(item);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setEditedItem({ ...editedItem, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    onUpdate(editedItem);
    setEditMode(false);
  };

  return (
    <div className="p-4 bg-white border shadow-md flex items-center justify-between">
      {!editMode ? (
        <>
          <div>
            <p>Type: {item.type}</p>
            <p>Amount: {item.amount}</p>
            <p>Start Date: {item.startDate.toLocaleDateString()}</p>
          </div>
          <div>
            <button onClick={() => setEditMode(true)} className="btn btn-blue">
              Edit
            </button>
            <button onClick={onDelete} className="btn btn-red">
              Delete
            </button>
          </div>
        </>
      ) : (
        <>
          <div>
            <select
              name="type"
              value={editedItem.type}
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
              value={editedItem.amount}
              onChange={handleInputChange}
              type="number"
              className="input input-bordered"
            />
            <input
              name="startDate"
              value={editedItem.startDate.toISOString().substring(0, 10)}
              onChange={handleInputChange}
              type="date"
              className="input input-bordered"
            />
          </div>
          <div>
            <button onClick={handleSave} className="btn btn-blue">
              Save
            </button>
            <button onClick={() => setEditMode(false)} className="btn btn-red">
              Cancel
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CompensationItem;
