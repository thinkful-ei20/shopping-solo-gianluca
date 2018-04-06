

const STORE = {
	showAll: true,
	searchText:'',
	sortBy: 'alpha',
	items: [
		{name: 'apples', checked: false},
		{name: 'oranges', checked: false},
		{name: 'milk', checked: true},
		{name: 'bread', checked: false}
	]
};


function generateItemElement(item, itemIndex) {
	return `
    <li class="js-item-index-element" data-item-index="${itemIndex}">
      <span class="shopping-item js-shopping-item ${item.checked ? 'shopping-item__checked' : ''}">${item.name}</span>
      <div class="shopping-item-controls">
        <button class="shopping-item-toggle js-item-toggle">
            <span class="button-label">check</span>
        </button>
        <button class="shopping-item-delete js-item-delete">
            <span class="button-label">delete</span>
		</button>
		<div class="js-edit-title edit-title">
			<button class="shopping-item-edit js-item-edit">
				<span class="button-label">edit</span>
			</button>
			<form id="js-edit-title-text-form">
				<input type="text" name="edit-title-text" class="js-edit-title-text" placeholder="e.g., broccoli">
			</form>
		</div>
      </div>
    </li>`;
}


function generateShoppingItemsString(shoppingList) {
	//const items = [...shoppingList];
	const items = shoppingList.
		filter(item => STORE.showAll === true || item.checked === false).
		filter(item => STORE.searchText.length === 0 || item.name.indexOf(STORE.searchText) > -1).
		map((item, index) => generateItemElement(item, index));
	return items.join('');
}


function renderShoppingList() {
	// render the shopping list in the DOM
	console.log('`renderShoppingList` ran');
	const shoppingItemsString = generateShoppingItemsString(STORE.items);

	// insert that HTML into the DOM
	$('.js-shopping-list').html(shoppingItemsString);
}

function getItemIndexFromElement(item) {
	const itemIndexString = $(item)
		.closest('.js-item-index-element')
		.attr('data-item-index');
	return parseInt(itemIndexString, 10);
}

function addItemToShoppingList(itemName) {
	console.log(`Adding "${itemName}" to shopping list`);
	STORE.items.push({name: itemName, checked: false});
}

function handleNewItemSubmit() {
	$('#js-shopping-list-form').submit( event => {
		event.preventDefault();
		console.log('`handleNewItemSubmit` ran');
		const newItemName = $('.js-shopping-list-entry').val();
		if(newItemName !== '') { //Prevent adding empty string to our list
			$('.js-shopping-list-entry').val('');
			addItemToShoppingList(newItemName);
			renderShoppingList();
		}
	});
}

function handleItemSearch() {
	$('.js-shopping-list-entry').keyup( event => {
		let searchText = $(event.currentTarget).val();
		STORE.searchText = searchText;
		renderShoppingList();
	});
}

function handleCompleteToggle() {
	$('#js-shopping-list-form').on('click', '.js-toggle-completed', event => {
		STORE.showAll = !STORE.showAll;
		renderShoppingList();
	});
}

function toggleCheckedForListItem(index) {
	console.log('Toggling checked property for item at index ' + index);
	STORE.items[index].checked = !STORE.items[index].checked;
}


function handleItemCheckClicked() {
	$('.js-shopping-list').on('click', '.js-item-toggle', event => {
		console.log('`handleItemCheckClicked` ran');
		const index = getItemIndexFromElement(event.currentTarget);
		toggleCheckedForListItem(index);
		renderShoppingList();
	});
}

function deleteListItem(index) {
	console.log('deleting item at index ' + index);
	STORE.items.splice(index, 1);
}

function handleDeleteItemClicked() {
	// this function will be responsible for when users want to delete a shopping list
	// item
	$('.js-shopping-list').on('click', '.js-item-delete', event => {
		console.log('`handleDeleteItemClicked` ran');
		const index = getItemIndexFromElement(event.currentTarget);
		deleteListItem(index);
		renderShoppingList();
	});
}

function EditListItem(index, text) {
	console.log('Editing item at index ' + index);
	STORE.items[index].name = text;
}

function handleItemEditClicked() {
	$('.js-shopping-list').on('click', '.js-item-edit', event => {
		console.log('`handleItemEditClicked` ran');
		const index = getItemIndexFromElement(event.currentTarget);
		const text = $(event.currentTarget).closest('div').find('input').val();
		if(text.length > 0)
			EditListItem(index,text);
		renderShoppingList();
	});
}

// this function will be our callback when the page loads. it's responsible for
// initially rendering the shopping list, and activating our individual functions
// that handle new item submission and user clicks on the "check" and "delete" buttons
// for individual shopping list items.
function handleShoppingList() {
	renderShoppingList();
	handleNewItemSubmit();
	handleItemSearch();
	handleCompleteToggle();
	handleItemCheckClicked();
	handleDeleteItemClicked();
	handleItemEditClicked();
}

// when the page loads, call `handleShoppingList`
$(handleShoppingList);