try {
    const c = require('./services/courseService');
    console.log('courseService loaded');
    console.log('buildCourseRecord type:', typeof c.buildCourseRecord);
    console.log('validateCoursePayload type:', typeof c.validateCoursePayload);
} catch (e) {
    console.error('Error loading courseService:', e);
}
