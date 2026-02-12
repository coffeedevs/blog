interface SlideshareProps {
  embedKey: string;
}

export default function Slideshare({ embedKey }: SlideshareProps) {
  return (
    <div style={{ textAlign: 'center', margin: '30px 0' }}>
      <iframe
        src={`//es.slideshare.net/slideshow/embed_code/key/${embedKey}`}
        width="425"
        height="355"
        frameBorder="0"
        marginWidth={0}
        marginHeight={0}
        scrolling="no"
        style={{
          border: '1px solid #CCC',
          borderWidth: '1px',
          marginBottom: '5px',
          maxWidth: '100%',
          margin: 'auto'
        }}
        allowFullScreen
      />
    </div>
  );
}
