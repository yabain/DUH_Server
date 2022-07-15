/**
 * Defines some App constants.
 * @author dassiorleando
 */
module.exports = {
    // Some Redis keys
    USERS: 'USERS',
    OFFERS: 'OFFERS',
    ITEMS: 'ITEMS',
    USER_EXTRA_FIELDS: [],

    // All possible user permissions
    PERMISSIONS: [ 'USER', 'MODERATOR', 'ADMIN' ],

    // Used for email sending
    fromEmailAddres: 'team@douhave.co',

    // Mailchimp mailing (audience) list id.
    mailchimpListId: '0945efc32c',

    // The email to receive App notificaitons/events.
    notificationsReceivers: [ 'team@douhave.co', 'team.douhave@gmail.com' ],

    // AWS-SES email templates.
    DOUHAVE_POST_TEMPLATE: 'DOUHAVE_POST_TEMPLATE',
    DOUHAVE_SIGNUP_TEMPLATE: 'DOUHAVE_SIGNUP_TEMPLATE'
};
