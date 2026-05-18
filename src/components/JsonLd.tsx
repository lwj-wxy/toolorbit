type JsonLdProps = {
  id: string;
  data: unknown;
};

export default function JsonLd({ id, data }: JsonLdProps) {
  return (
    <template
      id={id}
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, '\\u003c'),
      }}
    />
  );
}
