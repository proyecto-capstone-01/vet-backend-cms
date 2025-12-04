import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'

interface IframeSheetProps {
  src: string
  buttonText: string
  title?: string
  width?: string
  height?: string
  buttonVariant?: 'default' | 'outline' | 'ghost' | 'link' | 'destructive'
  buttonSize?: 'default' | 'sm' | 'lg'
  icon?: React.ReactNode
  iconPosition?: 'start' | 'end'
  iconOnly?: boolean
  iconSize?: number
}

export function IframeSheet({
  src,
  buttonText,
  title = 'Iframe Sheet',
  width = '100%',
  height = '100%',
  buttonVariant = 'default',
  buttonSize = 'default',
  icon,
  iconPosition = 'end',
  iconOnly = false,
  iconSize = 16,
}: IframeSheetProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant={buttonVariant}
          size={buttonSize}
          aria-label={iconOnly ? buttonText : undefined}
          className={iconOnly ? 'p-2' : 'inline-flex items-center'}
        >
          {icon && iconPosition === 'start' && (<span style={{ display: 'flex', alignItems: 'center', marginRight: '8px', fontSize: iconSize }}>{icon}</span>)}
          {!iconOnly && buttonText}
          {icon && iconPosition === 'end' && (
            <span style={{ display: 'flex', alignItems: 'center', marginLeft: '8px', fontSize: iconSize }}>{icon}</span>)}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
        </SheetHeader>
        <iframe src={src} style={{ width: width, height: height, border: 'none' }} title={title} />
      </SheetContent>
    </Sheet>
  )
}
