const Subject = require('../models/Subject');

class SubjectSeeder {
  // Upload subjects from JSON file
  static async uploadFromJSON(filePath) {
    try {
      const fs = require('fs');
      const subjects = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      
      const result = await Subject.insertMany(subjects, { ordered: false });
      console.log(`✅ ${result.length} subjects uploaded successfully`);
      return result;
    } catch (error) {
      console.error('❌ Error uploading subjects:', error.message);
      throw error;
    }
  }

  // Upload subjects from array
  static async uploadFromArray(subjectsArray) {
    try {
      const result = await Subject.insertMany(subjectsArray, { ordered: false });
      console.log(`✅ ${result.length} subjects uploaded successfully`);
      return result;
    } catch (error) {
      console.error('❌ Error uploading subjects:', error.message);
      throw error;
    }
  }

  // Clear all subjects (use with caution)
  static async clearAllSubjects() {
    try {
      const result = await Subject.deleteMany({});
      console.log(`🗑️ ${result.deletedCount} subjects removed`);
      return result;
    } catch (error) {
      console.error('❌ Error clearing subjects:', error.message);
      throw error;
    }
  }

  // Get subjects count by semester
  static async getSubjectStats() {
    try {
      const stats = await Subject.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: '$semester', count: { $sum: 1 } } },
        { $sort: { _id: 1 } }
      ]);
      
      console.log('📊 Subjects by semester:');
      stats.forEach(stat => {
        console.log(`  Semester ${stat._id}: ${stat.count} subjects`);
      });
      
      return stats;
    } catch (error) {
      console.error('❌ Error getting stats:', error.message);
      throw error;
    }
  }
}

module.exports = SubjectSeeder;