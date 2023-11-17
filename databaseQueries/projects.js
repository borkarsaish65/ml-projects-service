/**
 * name : projects.js
 * author : Priyanka
 * created-date : 01-Sep-2021
 * Description : Project categories helper for DB interactions.
 */

// Dependencies

/**
 * Projects
 * @class
 */

module.exports = class Projects {
  /**
   * Lists of projects document.
   * @method
   * @name projectDocument
   * @param {Array} [filterData = "all"] - project filter query.
   * @param {Array} [fieldsArray = "all"] - projected fields.
   * @param {Array} [skipFields = "none"] - field not to include
   * @returns {Array} Lists of projects.
   */

  static projectDocument(
    filterData = "all",
    fieldsArray = "all",
    skipFields = "none"
  ) {
    return new Promise(async (resolve, reject) => {
      try {
        let queryObject = filterData != "all" ? filterData : {};
        let projection = {};

        if (fieldsArray != "all") {
          fieldsArray.forEach((field) => {
            projection[field] = 1;
          });
        }

        if (skipFields !== "none") {
          skipFields.forEach((field) => {
            projection[field] = 0;
          });
        }

        let projects = await database.models.projects
          .find(queryObject, projection)
          .lean();
        return resolve(projects);
      } catch (error) {
        return reject(error);
      }
    });
  }

  /**
   * Get Aggregate of Project documents.
   * @method
   * @name getAggregate
   * @param {Object} [aggregateData] - aggregate Data.
   * @returns {Array} - Project data.
   */

  static getAggregate(aggregateData) {
    return new Promise(async (resolve, reject) => {
      try {
        let projectDocuments = await database.models.projects.aggregate(
          aggregateData
        );
        return resolve(projectDocuments);
      } catch (error) {
        return reject(error);
      }
    });
  }

  /**
   * Update project documents.
   * @method
   * @name findOneAndUpdate
   * @param {Object} [filterQuery] - filtered Query.
   * @param {Object} [updateData] - update data.
   * @returns {Object} - Project data.
   */

  static findOneAndUpdate(findQuery, UpdateObject, returnData = {}) {
    return new Promise(async (resolve, reject) => {
      try {
        let projectDocument = await database.models.projects.findOneAndUpdate(
          findQuery,
          UpdateObject,
          returnData
        );
        return resolve(projectDocument);
      } catch (error) {
        return reject(error);
      }
    });
  }

  /**
   * Create project documents.
   * @method
   * @name createProject
   * @param {Object} [projectData] - project Data.
   * @returns {Array} - Project data.
   */

  static createProject(projectData) {
    return new Promise(async (resolve, reject) => {
      try {
        let projectDocument = await database.models.projects.create(
          projectData
        );
        return resolve(projectDocument);
      } catch (error) {
        return reject(error);
      }
    });
  }

  /**
   * bulkUpdate function is used to do bulk operations.
   * @method
   * @name bulkUpdate
   * @param {Object} [projectData] - project Data along with filter and quries.
   * @returns {Object} - status of bulk operation.
   */
  static bulkUpdate(Data) {
    return new Promise(async (resolve, reject) => {
      try {
        let bulkUpdates = await database.models.projects.bulkWrite(Data);
        if (bulkUpdates.result.ok) {
          return resolve(bulkUpdates);
        }
      } catch (error) {
        return reject(error);
      }
    });
  }
};
