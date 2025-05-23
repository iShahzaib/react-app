import React from "react";

export const ChipsInput = ({ field, self }) => {
    const fieldData = self.state[field.name] || [];

    const [input, setInput] = React.useState('');
    const [chips, setChips] = React.useState(fieldData);

    const addChip = () => {
        const trimmed = input.trim();
        if (trimmed && !chips.includes(trimmed)) {
            const newChips = [...chips, trimmed];
            setChips(newChips);
            self.handleChange({
                target: {
                    name: field.name,
                    value: newChips
                }
            });
        }
        setInput('');
    };

    const removeChip = (index) => {
        const newChips = chips.filter((_, i) => i !== index);
        setChips(newChips);
        self.handleChange({
            target: {
                name: field.name,
                value: newChips
            }
        });
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addChip();
        }
    };

    return (
        <div className="chips-container">
            {chips.map((chip, index) => (
                <div key={index} className="chip-removable-container">
                    {chip}
                    <button
                        type="button"
                        className="remove-chip"
                        onClick={() => removeChip(index)}
                    >
                        &times;
                    </button>
                </div>
            ))}
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={field.placeholder || 'Add tag and press Enter'}
            />
        </div>
    );
};

export const ArrayInput = ({ field, self }) => {
    const fieldData = self.state[field.name];

    const handleArrayItemChange = (index, newValue) => {
        // const updated = [...(fieldData || [])];
        const updated = [...fieldData];
        updated[index] = newValue;
        self.handleChange({
            target: {
                name: field.name,
                value: updated
            }
        });
    };

    const addArrayItem = () => {
        // const updated = [...(fieldData || []), ''];
        const updated = [...fieldData, ''];
        self.handleChange({
            target: {
                name: field.name,
                value: updated
            }
        });
    };

    const removeArrayItem = (index) => {
        // const updated = [...(fieldData || [])];
        const updated = [...fieldData];
        updated.splice(index, 1);
        self.handleChange({
            target: {
                name: field.name,
                value: updated
            }
        });
    };

    return (
        <div>
            <label style={{ marginRight: "0.5rem" }}>{field.label}</label>
            {(fieldData || []).map((item, index) => (
                <div key={index} className="subtype-field">
                    <input
                        type="text"
                        value={item}
                        onChange={(e) => handleArrayItemChange(index, e.target.value)}
                        placeholder={field.placeholder || ''}
                        style={{ flex: 1 }}
                    />
                    <button
                        type="button"
                        className="ui negative basic button remove-subtype-field"
                        onClick={() => removeArrayItem(index)}
                    >
                        Remove
                    </button>
                </div>
            ))}
            <button
                type="button"
                className="ui positive basic button add-subtype-field"
                onClick={addArrayItem}
            >
                Add Item
            </button>
        </div>
    )
};