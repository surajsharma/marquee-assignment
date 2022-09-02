import React from "react";

const ListItems: React.FC<{
    items: string[];
    onSelect: (item: string) => void;
}> = ({ items, onSelect }) => {
    return (
        <ul className="dropdown-menu show w-50 mt-6">
            {items.map((item, index) => (
                <li
                    key={item + index}
                    className="dropdown-item"
                    onClick={() => onSelect(item)}
                >
                    {item}
                </li>
            ))}
        </ul>
    );
};

export default ListItems;
