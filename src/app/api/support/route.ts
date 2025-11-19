import { NextRequest, NextResponse } from 'next/server';

const WEBHOOK_URL = 'https://services.leadconnectorhq.com/hooks/sTzec3aUgGdmWIlduwGM/webhook-trigger/2a9ef919-18a2-4989-9776-159ddf1a6910';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const name = formData.get('name')?.toString() || '';
    const phone = formData.get('phone')?.toString() || '';
    const description = formData.get('description')?.toString() || '';
    const module = formData.get('module')?.toString() || '';
    const attachment = formData.get('attachment') as File | null;

    const payload: Record<string, any> = {
      name: name.trim(),
      phone: phone.trim(),
      description: description.trim(),
      module: module.trim(),
    };

    if (attachment && attachment.size > 0) {
      try {
        const arrayBuffer = await attachment.arrayBuffer();
        const base64 = Buffer.from(arrayBuffer).toString('base64');
        payload.attachment = {
          filename: attachment.name,
          content: base64,
          contentType: attachment.type || 'application/octet-stream',
          size: attachment.size,
        };
      } catch (fileError) {
        console.error('Error processing attachment:', fileError);
      }
    }

    console.log('Sending payload to webhook:', {
      ...payload,
      attachment: payload.attachment ? `[File: ${payload.attachment.filename}, ${payload.attachment.size} bytes]` : 'none',
    });

    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'Homio-Doc-Support-Form/1.0',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Webhook error:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
      });
      
      return NextResponse.json(
        { 
          error: 'Failed to submit to webhook',
          details: errorText || response.statusText,
          status: response.status 
        },
        { status: response.status }
      );
    }

    const responseData = await response.text();
    
    return NextResponse.json(
      { 
        success: true,
        message: 'Support request submitted successfully',
        data: responseData 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('API route error:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

