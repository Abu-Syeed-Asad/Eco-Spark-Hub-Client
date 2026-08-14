import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";


export default function StatsCard() {
  return (
    <Card className="shadow-md hover:shadow-lg transition-all ">
      <CardHeader>
        <CardTitle className="text-center font-bold text-2xl">
          User Data</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-around text-xl ">
        <div >
          <h2>Total Post</h2> 
          <p>500+</p>

        </div>
        <div>
        <h2>Top valueable Post</h2>
          <p>micro-plastic</p>
        </div>
        <div>
          <h2>Total Payment</h2>
          <p>2000 taka</p>
        </div>
        
      </CardContent>
    </Card>
  );
}