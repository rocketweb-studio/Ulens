import {Path} from "@/src/shared/constants/Path";

export const getTabsSettings = (params: URLSearchParams) => {
  return [
    {
      title: 'General information',
      href: Path.Settings('info'),
      isActive: params.get('part') === 'info',
    },
    {
      title: 'Devices',
      href: Path.Settings('devices'),
      isActive: params.get('part') === 'devices',
    },
    {
      title: 'Account Management',
      href: Path.Settings('subscriptions'),
      isActive: params.get('part') === 'subscriptions',
    },
    {
      title: 'My payments',
      href: Path.Settings('payments'),
      isActive: params.get('part') === 'payments',
    },
  ]
}