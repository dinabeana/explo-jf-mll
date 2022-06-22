
const combineArrays = (arr1, arr2) => {
  const combineIntoMultiDimArray = (...rows) => [...rows[0]].map((_, c) => rows.map(row => row[c]));
  const newArray = combineIntoMultiDimArray(arr1, arr2);
  return newArray;
};

export default combineArrays;
