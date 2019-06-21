// import React from "react";
// import PropTypes from "prop-types";

// // import { warningMessage } from "../../../../../components/notifications";
// // import { getParentItem } from "../../../../../helpers/GlobalHelper";

// // import MasterCells from "../../../../masterlist/containers/MasterCells";
// // import MasterSites from "../../../../masterlist/containers/MasterSites";

// // import { cleanFilter } from "../../../../../helpers/FilterHelper";
// // import { createTab } from "../../../../../helpers/TabsHelper";

// // import { getNEforMasterList } from "../../../requests";

// // import {
// //   initProcess,
// //   finishProcess,
// // } from "";

// // const allowedItems = [
// //   "vendor_id",
// //   "region_id",
// //   "arrFilterDate",
// //   "date",
// //   "filter",
// //   "flatpickrMode"
// // ];

// export default class MasterList extends React.Component {
//   constructor(props) {
//     super(props);

//     this.pid = getStr();
//   }

//   getMainFilterState = () => {
//     let filter = {};
//     const getFilterInternalState = getParentItem(
//       this,
//       "getFilterInternalState"
//     );

//     if (typeof getFilterInternalState === "function")
//       filter = getFilterInternalState();

//     return filter;
//   };

//   getNeList = filterType => {
//     return new Promise((resolve, reject) => {
//       const mainFilter = this.getMainFilterState();
//       mainFilter.filter = filterType;

//       this.startLoading();
//       getNEforMasterList(mainFilter)
//         .then(neList => {
//           this.finishLoading();
//           resolve(neList);
//         })
//         .catch(err => {
//           this.finishLoading();
//           reject(err);
//         });
//     });
//   };

//   loadMasterCells = () => {
//     const mainFilter = this.getMainFilterState();
//     if (!this.isFilterValidForMasterList(mainFilter)) return;

//     this.getNeList("CEL_ID").then(neList => {
//       const cleanedFilter = cleanFilter(mainFilter, allowedItems);
//       cleanedFilter.filter = neList[0];

//       const tabData = {
//         active: true,
//         title: "MasterCells",
//         component: MasterCells,
//         props: {
//           mainFilter: cleanedFilter
//         }
//       };

//       createTab(tabData, false);
//     });
//   };

//   loadMasterSites = () => {
//     const mainFilter = this.getMainFilterState();
//     if (!this.isFilterValidForMasterList(mainFilter)) return;

//     this.getNeList("BTS_ID").then(neList => {
//       const cleanedFilter = cleanFilter(mainFilter, allowedItems);
//       cleanedFilter.filter = neList[0];

//       const tabData = {
//         active: true,
//         title: "MasterSites",
//         component: MasterSites,
//         props: {
//           mainFilter: cleanedFilter
//         }
//       };

//       createTab(tabData, false);
//     });
//   };

//   isFilterValidForMasterList = filter => {
//     try {
//       this.validateFilterForMasterList(filter);
//     } catch (Ex) {
//       warningMessage("Warning", Ex);
//       return false;
//     }

//     return true;
//   };

//   validateFilterForMasterList = (filter = {}) => {
//     if (filter.groupDateTime !== "24h")
//       throw "Invalid filter granularity for MasterList";
//     if (!filter.vendor_id)
//       throw "Invalid vendor for MasterList, please select a Vendor";
//     if (!filter.arrFilterDate || filter.arrFilterDate.length === 0)
//       throw "Invalid date, please select a date";
//   };

//   startLoading = () => {
//     store.dispatch(initProcess(this.pid));
//   };

//   finishLoading = () => {
//     store.dispatch(finishProcess(this.pid));
//   };

//   render() {
//     return (
//       <div className="cl-element">
//         <div className="row">
//           <ol className="inside-sidebar-accordion-ol">
//             <li>
//               {" "}
//               <a onClick={this.loadMasterCells}> MasterCells </a>
//             </li>
//             <li>
//               {" "}
//               <a onClick={this.loadMasterSites}> MasterSites </a>{" "}
//             </li>
//           </ol>
//         </div>
//       </div>
//     );
//   }
// }

// MasterList.contextTypes = {
//   parentState: PropTypes.object.isRequired,
//   updateParent: PropTypes.func.isRequired
// };
