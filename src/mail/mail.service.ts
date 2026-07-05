import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendMailConfirmation(destinataire: string, order: any) {
    // console.log(
    //   '------------------- order -------------------------' +
    //     JSON.stringify(order),
    // );
    await this.mailerService.sendMail({
      to: destinataire,
      subject: `Commande #${order.id_commande} confirmée`,
      text: 'Confirmation de votre status commande sur la plateforme Rafiacraft',
      html: this.orderConfirmationEmail(order),
    });
    return 'mail sent!';
  }

  private orderConfirmationEmail = (order: any) => {
    return `
  <!DOCTYPE html>
  <html lang="fr">
  <head>
  <meta charset="UTF-8">
  <title>Confirmation de commande</title>
  </head>
  
  <body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial">
  
  <div style="max-width:600px;margin:auto;background:#fff;border-radius:10px;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,0.1)">
  
  <!-- HEADER -->
  <div style="background:#0d6efd;color:#fff;padding:20px;text-align:center">
    <h2 style="margin:0">Merci pour votre commande 🎉</h2>
    <p style="margin:5px 0 0">Commande #${order.id_commande}</p>
  </div>
  
  <!-- BODY -->
  <div style="padding:20px;color:#333">
  
    <p>Bonjour <strong>${order.user.name}</strong>,</p>
  
    <p>Nous avons bien reçu votre commande et elle est maintenant <strong>${order.statut}</strong>.</p>
  
    <hr>
  
    <!-- INFOS COMMANDE -->
    <h3>📦 Informations de la commande</h3>
  
    <p><strong>Statut :</strong> ${order.statut}</p>
    <p><strong>Livraison :</strong> ${order.statut_livraison}</p>
    <p><strong>Date :</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
  
    <hr>
  
    <!-- ADRESSE -->
    <h3>🏠 Adresse de livraison</h3>
    <p>
      ${order.adresse_livraison}<br>
      ${order.ville}, ${order.region}
    </p>
  
    <hr>
  
    <!-- PRODUITS -->
    <h3>🛍 Produits</h3>
  
    ${order.items
      .map(
        (item: any) => `
        <div style="border-bottom:1px solid #eee;padding:10px 0">
          <strong>${item.product.nom_produit}</strong><br>
          <small>${item.product.sous_category.nom_sous_categorie}</small><br>
          Quantité : ${item.quantite}<br>
          Prix : ${item.prix} €
        </div>
      `,
      )
      .join('')}
  
    <hr>
  
    <!-- TOTAL -->
    <h2 style="text-align:right;color:#0d6efd">
      Total : ${order.total} €
    </h2>
  
    <!-- CONTACT -->
    <p style="margin-top:20px">
      📞 Contact : ${order.user.phone}<br>
      📧 Email : ${order.user.email}
    </p>
  
    <p style="font-size:12px;color:#777">
      Merci pour votre confiance 💙
    </p>
  
  </div>
  
  <!-- FOOTER -->
  <div style="background:#f1f1f1;text-align:center;padding:15px;font-size:12px;color:#666">
    Rafiacraft - Artisanat Malagasy
  </div>
  
  </div>
  
  </body>
  </html>
  `;
  };
}
