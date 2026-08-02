import { DestinationId } from "@/lib/cloud/types";

interface IconProps {
  className?: string;
}

function DownloadIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor">
      <path
        fillRule="evenodd"
        d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function EmailIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor">
      <path d="M2.94 6.94a2.25 2.25 0 011.591-.658h11a2.25 2.25 0 011.591.658L10 12.06 2.94 6.94z" />
      <path d="M2 8.118V14.5A2.25 2.25 0 004.25 16.75h11.5A2.25 2.25 0 0018 14.5V8.118l-7.386 5.55a1 1 0 01-1.228 0L2 8.118z" />
    </svg>
  );
}

function SheetsIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor">
      <path
        fillRule="evenodd"
        d="M4 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H4zm1 3h4v3H5V6zm6 0h4v3h-4V6zM5 11h4v3H5v-3zm6 0h4v3h-4v-3z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function BoxIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor">
      <path d="M10 2l7 4-7 4-7-4 7-4z" />
      <path d="M3 7.5v6l7 4 7-4v-6l-7 4-7-4z" />
    </svg>
  );
}

function CloudIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor">
      <path d="M5.5 15a4.5 4.5 0 01-.416-8.984A5.5 5.5 0 0115.9 8.02 3.5 3.5 0 0115 15H5.5z" />
    </svg>
  );
}

export const DESTINATION_ICONS: Record<
  DestinationId,
  (props: IconProps) => JSX.Element
> = {
  download: DownloadIcon,
  email: EmailIcon,
  "google-sheets": SheetsIcon,
  dropbox: BoxIcon,
  onedrive: CloudIcon,
};
