import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

export function AuthCardShell({ eyebrow, title, description, children }) {
  return (
    <section>
      <div className="container flex min-h-[calc(100vh-13rem)] items-center justify-center py-12">
        <Card className="w-full max-w-md p-0 gap-0">
          <CardHeader className="gap-3 border-b p-6 text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-highlight">
              {eyebrow}
            </p>
            <CardTitle className="text-3xl font-bold">{title}</CardTitle>
            {description && (
              <p className="text-sm leading-relaxed text-muted-foreground">
                {description}
              </p>
            )}
          </CardHeader>
          <CardContent className="p-6">{children}</CardContent>
        </Card>
      </div>
    </section>
  );
}
