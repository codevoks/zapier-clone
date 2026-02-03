import { footerColumn, footerColumns } from '../../../types'

const column1: footerColumn = {
  heading: 'Top searches',
  entries: [
    { title: 'Slack integrations', path: 'slackintegrations' },
    { title: 'Salesforce integrations', path: 'salesforceintegrations' },
    { title: 'HubSpot CRM integrations', path: 'hubspotcrmintegrations' },
    { title: 'PayPal integrations', path: 'paypalintegrations' },
    { title: 'Asana integrations', path: 'asanaintegrations' },
  ],
}

const column2: footerColumn = {
  heading: 'Popular Apps',
  entries: [
    { title: 'Dropbox', path: 'dropbox' },
    { title: 'Goodle Sheet', path: 'googlesheet' },
    { title: 'Docusign', path: 'docusign' },
    { title: 'WordPress', path: 'wordpress' },
    { title: 'Office 365', path: 'office365' },
  ],
}

const column3: footerColumn = {
  heading: 'Trending Apps',
  entries: [
    { title: 'Twitch', path: 'twitch' },
    { title: 'Calendy', path: 'calendy' },
    { title: 'Microsoft To-Do', path: 'microsofttodo' },
    { title: 'Microsoft Outlook', path: 'microsoftoutlook' },
    { title: 'Medium', path: 'medium' },
  ],
}

const column4: footerColumn = {
  heading: 'Top apps by Category',
  entries: [
    { title: 'Project Management', path: 'projectmanagement' },
    { title: 'Calendar', path: 'calendar' },
    { title: 'Email', path: 'email' },
    { title: 'CRM', path: 'crms' },
    { title: 'Marketing', path: 'marketing' },
  ],
}

const column5: footerColumn = {
  heading: 'Our best content',
  entries: [
    {
      title: 'Best Video Conferencing Apps',
      path: 'bestvideoconferencingapps',
    },
    { title: 'Best Email Apps', path: 'bestemailapps' },
    { title: 'Best CRM Apps', path: 'bestcrmapps' },
    { title: 'Best Note Taking Apps', path: 'bestnotetakingapps' },
    { title: 'Best Calendar Apps', path: 'bestcalendarapps' },
  ],
}

export const footerColumnData: footerColumns = [
  column1,
  column2,
  column3,
  column4,
  column5,
]
