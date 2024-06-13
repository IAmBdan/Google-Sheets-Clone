/* eslint-disable */
var addSorting = (function() {
    'use strict';
    /**
     * @type {string | any[]}
     */
    var cols,
        currentSort = {
            index: 0,
            desc: false
        };

    // returns the summary table element
    function getTable() {
        return document.querySelector('.coverage-summary');
    }
    // returns the thead element of the summary table
    function getTableHeader() {
        // @ts-ignore
        return getTable().querySelector('thead tr');
    }
    // returns the tbody element of the summary table
    function getTableBody() {
        // @ts-ignore
        return getTable().querySelector('tbody');
    }
    // returns the th element for nth column
    // @ts-ignore
    function getNthColumn(n) {
        // @ts-ignore
        return getTableHeader().querySelectorAll('th')[n];
    }

    function onFilterInput() {
        // @ts-ignore
        const searchValue = document.getElementById('fileSearch').value;
        // @ts-ignore
        const rows = document.getElementsByTagName('tbody')[0].children;
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            if (
                // @ts-ignore
                row.textContent
                    .toLowerCase()
                    .includes(searchValue.toLowerCase())
            ) {
                // @ts-ignore
                row.style.display = '';
            } else {
                // @ts-ignore
                row.style.display = 'none';
            }
        }
    }

    // loads the search box
    function addSearchBox() {
        var template = document.getElementById('filterTemplate');
        // @ts-ignore
        var templateClone = template.content.cloneNode(true);
        templateClone.getElementById('fileSearch').oninput = onFilterInput;
        // @ts-ignore
        template.parentElement.appendChild(templateClone);
    }

    // loads all columns
    function loadColumns() {
        // @ts-ignore
        var colNodes = getTableHeader().querySelectorAll('th'),
            colNode,
            cols = [],
            col,
            i;

        for (i = 0; i < colNodes.length; i += 1) {
            colNode = colNodes[i];
            col = {
                // @ts-ignore
                key: colNode.getAttribute('data-col'),
                // @ts-ignore
                sortable: !colNode.getAttribute('data-nosort'),
                // @ts-ignore
                type: colNode.getAttribute('data-type') || 'string'
            };
            cols.push(col);
            if (col.sortable) {
                // @ts-ignore
                col.defaultDescSort = col.type === 'number';
                // @ts-ignore
                colNode.innerHTML =
                    // @ts-ignore
                    colNode.innerHTML + '<span class="sorter"></span>';
            }
        }
        return cols;
    }
    // attaches a data attribute to every tr element with an object
    // of data values keyed by column name
    // @ts-ignore
    function loadRowData(tableRow) {
        var tableCols = tableRow.querySelectorAll('td'),
            colNode,
            col,
            data = {},
            i,
            val;
        for (i = 0; i < tableCols.length; i += 1) {
            colNode = tableCols[i];
            col = cols[i];
            val = colNode.getAttribute('data-value');
            if (col.type === 'number') {
                val = Number(val);
            }
            // @ts-ignore
            data[col.key] = val;
        }
        return data;
    }
    // loads all row data
    function loadData() {
        // @ts-ignore
        var rows = getTableBody().querySelectorAll('tr'),
            i;

        for (i = 0; i < rows.length; i += 1) {
            // @ts-ignore
            rows[i].data = loadRowData(rows[i]);
        }
    }
    // sorts the table using the data for the ith column
    // @ts-ignore
    function sortByIndex(index, desc) {
        var key = cols[index].key,
            // @ts-ignore
            sorter = function(a, b) {
                a = a.data[key];
                b = b.data[key];
                return a < b ? -1 : a > b ? 1 : 0;
            },
            finalSorter = sorter,
            tableBody = document.querySelector('.coverage-summary tbody'),
            // @ts-ignore
            rowNodes = tableBody.querySelectorAll('tr'),
            rows = [],
            i;

        if (desc) {
            // @ts-ignore
            finalSorter = function(a, b) {
                return -1 * sorter(a, b);
            };
        }

        for (i = 0; i < rowNodes.length; i += 1) {
            rows.push(rowNodes[i]);
            // @ts-ignore
            tableBody.removeChild(rowNodes[i]);
        }

        rows.sort(finalSorter);

        for (i = 0; i < rows.length; i += 1) {
            // @ts-ignore
            tableBody.appendChild(rows[i]);
        }
    }
    // removes sort indicators for current column being sorted
    function removeSortIndicators() {
        var col = getNthColumn(currentSort.index),
            // @ts-ignore
            cls = col.className;

        cls = cls.replace(/ sorted$/, '').replace(/ sorted-desc$/, '');
        // @ts-ignore
        col.className = cls;
    }
    // adds sort indicators for current column being sorted
    function addSortIndicators() {
        // @ts-ignore
        getNthColumn(currentSort.index).className += currentSort.desc
            ? ' sorted-desc'
            : ' sorted';
    }
    // adds event listeners for all sorter widgets
    function enableUI() {
        var i,
            el,
            // @ts-ignore
            ithSorter = function ithSorter(i) {
                var col = cols[i];

                return function() {
                    var desc = col.defaultDescSort;

                    if (currentSort.index === i) {
                        desc = !currentSort.desc;
                    }
                    sortByIndex(i, desc);
                    removeSortIndicators();
                    currentSort.index = i;
                    currentSort.desc = desc;
                    addSortIndicators();
                };
            };
        for (i = 0; i < cols.length; i += 1) {
            if (cols[i].sortable) {
                // add the click event handler on the th so users
                // dont have to click on those tiny arrows
                // @ts-ignore
                el = getNthColumn(i).querySelector('.sorter').parentElement;
                // @ts-ignore
                if (el.addEventListener) {
                    // @ts-ignore
                    el.addEventListener('click', ithSorter(i));
                } else {
                    // @ts-ignore
                    el.attachEvent('onclick', ithSorter(i));
                }
            }
        }
    }
    // adds sorting functionality to the UI
    return function() {
        if (!getTable()) {
            return;
        }
        cols = loadColumns();
        loadData();
        addSearchBox();
        addSortIndicators();
        enableUI();
    };
})();

window.addEventListener('load', addSorting);
