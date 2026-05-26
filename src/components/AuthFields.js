import { FaEnvelope, FaEye, FaEyeSlash, FaLock, FaUser } from 'react-icons/fa';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from './ui/input-group';

const fieldIcons = {
  email: FaEnvelope,
  lock: FaLock,
  user: FaUser,
};

export function AuthField({
  icon,
  label,
  showPassword,
  onTogglePassword,
  ...inputProps
}) {
  const Icon = fieldIcons[icon];
  const hasPasswordToggle = typeof onTogglePassword === 'function';

  return (
    <label className="grid gap-2 text-sm font-medium">
      <span>{label}</span>
      <InputGroup className="h-11 bg-background/60">
        {Icon && (
          <InputGroupAddon>
            <Icon />
          </InputGroupAddon>
        )}
        <InputGroupInput className="h-10 text-base" {...inputProps} />
        {hasPasswordToggle && (
          <InputGroupAddon align="inline-end">
            <InputGroupButton
              size="icon-sm"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              onClick={onTogglePassword}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </InputGroupButton>
          </InputGroupAddon>
        )}
      </InputGroup>
    </label>
  );
}
