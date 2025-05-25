/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState } from 'react';
import classNames from 'classnames';
import './App.scss';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

const users = usersFromServer;
const categories = categoriesFromServer;
const COLUMNS = ['ID', 'Product', 'Category', 'User'];

const products = productsFromServer.map(product => {
  const category = categories.find(categorie => {
    return categorie.id === product.categoryId;
  });
  const user = users.find(oneUser => {
    return oneUser.id === category.ownerId;
  });

  return {
    ...product,
    category,
    user,
  };
});

export const App = () => {
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);

  const filteredProductsForUsers =
    selectedUserId === null
      ? products
      : products.filter(product => product.user.id === selectedUserId);

  const filteredProductsForCategories =
    selectedCategories.length === 0
      ? filteredProductsForUsers
      : filteredProductsForUsers.filter(product =>
        selectedCategories.includes(product.category.title)); // prettier-ignore

  const filteredProductsForInput =
    searchQuery === ''
      ? filteredProductsForCategories
      : filteredProductsForCategories.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())); // prettier-ignore

  function handleSearchChange(event) {
    setSearchQuery(event.target.value);
  }

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const hasResults = filteredProductsForInput.length > 0;

  const handleResetAllFilters = () => {
    setSelectedUserId(null);
    setSearchQuery('');
    setSelectedCategories([]);
  };

  const handleCategoryClick = categoryTitle => {
    setSelectedCategories(prevCategories => {
      if (prevCategories.includes(categoryTitle)) {
        return prevCategories.filter(categorie => categorie !== categoryTitle);
      }

      return [...prevCategories, categoryTitle];
    });
  };

  const handleAllCategoriesClick = () => {
    setSelectedCategories([]);
  };

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                data-cy="FilterAllUsers"
                href="#/"
                className={classNames('panel-tabs__item', {
                  'is-active': selectedUserId === null,
                })}
                onClick={() => setSelectedUserId(null)}
              >
                All
              </a>
              {users.map(user => (
                <a
                  key={user.id}
                  data-cy="FilterUser"
                  href="#/"
                  className={classNames('panel-tabs__item', {
                    'is-active': selectedUserId === user.id,
                  })}
                  onClick={() => setSelectedUserId(user.id)}
                >
                  {user.name}
                </a>
              ))}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                {searchQuery && (
                  <span className="icon is-right">
                    <button
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
                      onClick={handleClearSearch}
                    />
                  </span>
                )}
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className={classNames('button', 'is-success', 'mr-6', {
                  'is-outlined': selectedCategories.length > 0,
                })}
                onClick={handleAllCategoriesClick}
              >
                All
              </a>
              {categories.map(categorie => (
                <a
                  key={categorie.id}
                  data-cy="Category"
                  className={classNames('button', 'mr-2', 'my-1', {
                    'is-info': selectedCategories.includes(categorie.title),
                  })}
                  href="#/"
                  onClick={() => handleCategoryClick(categorie.title)}
                >
                  {categorie.title}
                </a>
              ))}
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={handleResetAllFilters}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {!hasResults && (
            <p data-cy="NoMatchingMessage">
              No products matching selected criteria
            </p>
          )}

          {hasResults && (
            <table
              data-cy="ProductTable"
              className="table is-striped is-narrow is-fullwidth"
            >
              <thead>
                <tr>
                  {COLUMNS.map(column => (
                    <th key={column}>
                      <span className="is-flex is-flex-wrap-nowrap">
                        {column}
                        <a href="#/">
                          <span className="icon">
                            <i data-cy="SortIcon" className="fas fa-sort" />
                          </span>
                        </a>
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {filteredProductsForInput.map(product => (
                  <tr key={product.id} data-cy="Product">
                    <td className="has-text-weight-bold" data-cy="ProductId">
                      {product.id}
                    </td>

                    <td data-cy="ProductName">{product.name}</td>
                    <td data-cy="ProductCategory">
                      {product.category.icon} - {product.category.title}
                    </td>

                    <td
                      data-cy="ProductUser"
                      className={
                        product.user.sex === 'm'
                          ? 'has-text-link'
                          : 'has-text-danger'
                      }
                    >
                      {product.user.name}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
