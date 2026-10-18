export function ContributePage() {
  return <Page title="Contribute Experience" note="Service → Visit → Experience → Review." />;
}

function Page({ title, note }: { title: string; note: string }) {
  return (
    <section className="p-6 pb-24">
      <h1 className="text-3xl font-bold">{title}</h1>
      <p className="mt-2 text-slate-600">{note}</p>
    </section>
  );
}
