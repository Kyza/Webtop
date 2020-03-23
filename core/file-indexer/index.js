(() => {
	const fsp = require("fs").promises;
	const path = require("path");
	const stringSimilarity = require("string-similarity");

	const homedir = require("os").homedir();
	const programFiles64Bit = "C:/Program Files/";
	const programFiles32Bit = "C:/Program Files (x86)/";

	String.prototype.reverse = function() {
		return this.split("")
			.reverse()
			.join("");
	};
	String.prototype.replaceLast = function(find, replace) {
		var index = this.lastIndexOf(find);
		if (index >= 0) {
			return (
				this.substring(0, index) +
				replace +
				this.substring(index + find.length)
			);
		}
		return this.toString();
	};
	String.prototype.replaceAll = function(search, replacement) {
		var target = this;
		return target.split(search).join(replacement);
	};

	var indexedItems = [];

	module.exports.index = async () => {
		async function* getFiles(dir) {
			const dirents = await fsp.readdir(dir, { withFileTypes: true });
			for (const dirent of dirents) {
				const res = path.resolve(dir, dirent.name);
				yield res;
				if (dirent.isDirectory()) {
					yield* getFiles(res);
				}
			}
		}

		let indexItem = async itemPath => {
			let itemStats;

			try {
				// Try getting the stats.
				itemStats = await fsp.stat(itemPath);
			} catch (e) {}

			let itemName = itemPath.split("\\")[
				itemPath.split("\\").length - 1
			];

			let owner = "";
			if (
				itemPath.startsWith(programFiles64Bit.replaceAll("/", "\\")) ||
				itemPath.startsWith(programFiles32Bit.replaceAll("/", "\\"))
			) {
				owner = itemPath
					.replace(programFiles64Bit.replaceAll("/", "\\"), "")
					.replace(programFiles32Bit.replaceAll("/", "\\"), "")
					.split("\\")[0];
			}

			let itemData = {
				path: itemPath,
				stats: itemStats,
				owner
			};

			try {
				// If the item is a file...
				if (itemStats.isFile()) {
					// Set the name, extension and type.
					itemData.name = itemName.replaceLast(
						`.${
							itemName.split(".")[itemName.split(".").length - 1]
						}`,
						""
					);
					itemData.extension = itemName.split(".")[
						itemName.split(".").length - 1
					];
					itemData.type = "file";
				} else {
					// Otherwise, the item is a directory.
					// So just set the name.
					itemData.name = itemName;
					itemData.type = "folder";
				}
			} catch (e) {
				itemData.name = itemName;
				itemData.type = "unknown";
			}

			indexedItems.push(itemData);
		};

		for await (const item of getFiles(homedir)) {
			await indexItem(item);
		}
		for await (const item of getFiles(programFiles64Bit)) {
			await indexItem(item);
		}
		for await (const item of getFiles(programFiles32Bit)) {
			await indexItem(item);
		}
	};

	module.exports.search = query => {
		let itemsFound = [];

		// Loop over all the items in the file system that have been indexed.
		for (let i = 0; i < indexedItems.length; i++) {
			let item = indexedItems[i];

			//  If the item has an owner...
			//  AND
			//  If the item or the owner contain each other...
			// OR
			// If the item or the name contain each other...
			if (
				(item.owner.length > 0 &&
					(item.owner.toLowerCase().indexOf(query.toLowerCase()) >
						-1 ||
						query.toLowerCase().indexOf(item.owner.toLowerCase()) >
							-1)) ||
				item.name.toLowerCase().indexOf(query.toLowerCase()) > -1 ||
				query.toLowerCase().indexOf(item.name.toLowerCase()) > -1
			) {
				// Calculate the similarity.
				item.similarity =
					(stringSimilarity.compareTwoStrings(query, item.owner) +
						stringSimilarity.compareTwoStrings(
							query,
							`${item.name}${
								item.extension ? `.${item.extension}` : ""
							}`
						)) /
					2;
				// Add the item.
				itemsFound.push(item);
			}
		}

		// Sort the items by the similarity.
		// Highest to lowest.
		return itemsFound.sort((a, b) => b.similarity - a.similarity);
	};
})();
