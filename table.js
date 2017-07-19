class Table {
	constructor(e) {
		this.element = e;
		this.body = this.element.querySelector('tbody');
		this.body['sorting'] = new Set();
		this.observer = new MutationObserver((records, observer) => {
			this.mutationHandler(records, observer);
		});
		this.observe();
		this.enableSorting(this.element.querySelector('thead'))
	}

	observe() {
		this.observer.observe(this.element, {
			attributes: true,
			childList: true,
			characterData: true,
			subtree: true
		});
	}

	enableSorting(e) {
		var columns = e.querySelectorAll("tr > td");
		for (var x = 0; x < columns.length; x++) {
			columns[x].addEventListener('click', (e) => {

				this.observer.disconnect();

				var sorting = 1;
				if (e.target.hasAttribute('data-sorting')) {
					sorting = e.target.getAttribute('data-sorting') * 1;
					if (sorting === 1) {
						sorting = -1;
					} else {
						sorting = 1;
					}
				}
				this.sort(e.target.cellIndex, sorting);
				e.target.setAttribute('data-sorting', sorting);
				this.body.setAttribute('data-last-sorting-index', e.target.cellIndex);
				this.body['sorting'].add(e.target.cellIndex);

				this.observe();

			});
		}
	}

	resort() {
		console.log(this.body.getAttribute('data-last-sorting-index'));
	}

	sort(columnIndex, direction) {
		var nodes = Array.prototype.slice.call(this.body.querySelectorAll("tr"));
		nodes.sort((a, b) => {
			if (a.children[columnIndex].innerText < b.children[columnIndex].innerText) return (-1 * direction);
			if (a.children[columnIndex].innerText > b.children[columnIndex].innerText) return (1 * direction);
			return 0;
		})
		while (this.body.firstChild) {
			this.body.removeChild(this.body.firstChild);
		}
		for (var x = 0; x < nodes.length; x++) {
			this.body.appendChild(nodes[x]);
		}
	}

	mutationHandler(records, observer) {
		console.log('observer');
		console.log(records);
		this.resort();
	}
}
