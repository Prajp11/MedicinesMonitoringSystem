import React from 'react';

const items = [
  { id: 1, name: 'Medicine A', status: 'Approved' },
  { id: 2, name: 'Consumable B', status: 'Rejected' },
  { id: 3, name: 'Medicine C', status: 'Pending' },
];

const ItemList = ({ setSelectedItem }) => {
  return (
    <div className="item-list">
      <h3>Items Received</h3>
      <ul>
        {items.map(item => (
          <li key={item.id} onClick={() => setSelectedItem(item)}>
            {item.name} - {item.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ItemList;