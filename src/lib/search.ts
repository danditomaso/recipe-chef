export function binarySearch<T>(items: T[], target: T) {
  let left = 0;
  let right = items.length - 1;
  let middle = Math.floor((right + left) / 2);

  while (items[middle] != target && left < right) {
    //adjust search area
    if (target < items[middle]) {
      right = middle - 1;
    } else if (target > items[middle]) {
      left = middle + 1;
    }

    //recalculate middle
    middle = Math.floor((right + left) / 2);
  }

  //make sure it's the righttarget
  return items[middle] != target ? -1 : middle;
}
