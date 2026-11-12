import NGODirectory from '@/components/donate/NGODirectory';
import DonationForm from '@/components/donate/DonationForm';

export default function DonatePage() {
  return (
    <div className="space-y-12">
      <NGODirectory />
      <div id="form" className="scroll-mt-32">
        <DonationForm />
      </div>
    </div>
  );
}
