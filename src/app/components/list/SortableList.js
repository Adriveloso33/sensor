import React from 'react';
import { SortableContainer, SortableElement, SortableHandle, arrayMove } from 'react-sortable-hoc';

// This can be any component you want
const DragHandle = SortableHandle(() => <i className="fa fa-reorder sortable-list-order-handler" />);

const SortableItem = SortableElement((props) => {
  const { removeButton = false, inlineContent: InlineContent, itemsIds, itemsConfig, indexNumber } = props || {};

  let itemId = 0;
  let inlineInitialConfig = {};
  if (InlineContent) {
    itemId = itemsIds[indexNumber];
    if (itemsConfig && itemsConfig[itemId]) inlineInitialConfig = itemsConfig[itemId];
  }

  return (
    <div className="sortable-list-item">
      <DragHandle />
      <span className="sortable-list-value">{props.value}</span>

      {InlineContent && (
        <InlineContent value={props.value} id={itemId} indexNumber={indexNumber} {...inlineInitialConfig} />
      )}

      {removeButton && (
        <span className="sortable-list-remove">
          <i className="fa fa-times" onClick={props.onRemoveElement.bind(this, props.value)} />
        </span>
      )}
    </div>
  );
});

const SortableHtmlList = SortableContainer((props) => {
  return (
    <div className="sortable-list">
      {props.items.map((value, index) => {
        return (
          <SortableItem
            key={`item-${index}`}
            index={index}
            indexNumber={index}
            value={value}
            removeButton={props.removeButton}
            onRemoveElement={props.onRemoveElement}
            {...props}
          />
        );
      })}
    </div>
  );
});

export default class SortableList extends React.Component {
  onSortEnd = ({ oldIndex, newIndex }) => {
    const prevItems = this.props.items.slice();
    const newItems = arrayMove(prevItems, oldIndex, newIndex);

    const { onChangeOrder } = this.props;
    if (typeof onChangeOrder === 'function') onChangeOrder(newItems);
  };

  onRemoveElement = (value) => {
    const { onRemoveElement } = this.props;
    if (typeof onRemoveElement === 'function') onRemoveElement(value);
  };

  render() {
    return (
      <SortableHtmlList
        useDragHandle
        hideSortableGhost
        items={this.props.items}
        removeButton={this.props.removeButton}
        onSortEnd={this.onSortEnd}
        onRemoveElement={this.onRemoveElement}
        {...this.props}
      />
    );
  }
}
