// 🎤 TEST RAPIDE RECHERCHE VOCALE
// Copier-coller ce script dans la console du navigateur (F12) sur http://localhost:3002

console.log('🎤 DIAGNOSTIC RECHERCHE VOCALE E-COMMERCE STORE');
console.log('================================================');

// 1. Vérifier le support de l'API
const checkAPISupport = () => {
  const hasWebkit = 'webkitSpeechRecognition' in window;
  const hasNative = 'SpeechRecognition' in window;
  
  console.log('🌐 Support du navigateur:');
  console.log('  - webkitSpeechRecognition:', hasWebkit ? '✅ OUI' : '❌ NON');
  console.log('  - SpeechRecognition:', hasNative ? '✅ OUI' : '❌ NON');
  
  if (!hasWebkit && !hasNative) {
    console.log('❌ ERREUR: Ce navigateur ne supporte pas la reconnaissance vocale');
    console.log('💡 SOLUTION: Utilisez Chrome, Edge ou Safari');
    return false;
  }
  
  return true;
};

// 2. Vérifier les permissions microphone
const checkMicrophonePermissions = async () => {
  console.log('\n🎙️ Test des permissions microphone...');
  
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    console.log('✅ Microphone accessible');
    
    // Arrêter le stream immédiatement
    stream.getTracks().forEach(track => track.stop());
    return true;
    
  } catch (err) {
    console.log('❌ Erreur microphone:', err.name);
    
    switch (err.name) {
      case 'NotAllowedError':
        console.log('💡 SOLUTION: Autoriser l\'accès au microphone dans les paramètres du navigateur');
        break;
      case 'NotFoundError':
        console.log('💡 SOLUTION: Vérifier qu\'un microphone est connecté');
        break;
      case 'NotReadableError':
        console.log('💡 SOLUTION: Le microphone est peut-être utilisé par une autre application');
        break;
      default:
        console.log('💡 SOLUTION: Vérifier les paramètres audio du système');
    }
    
    return false;
  }
};

// 3. Tester la reconnaissance vocale
const testSpeechRecognition = () => {
  console.log('\n🧪 Test de la reconnaissance vocale...');
  
  try {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    // Configuration
    recognition.lang = 'fr-FR';
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    
    // Event handlers
    recognition.onstart = () => {
      console.log('🎤 Reconnaissance démarrée - PARLEZ MAINTENANT !');
      console.log('📝 Essayez de dire: "iPhone", "Samsung", "ordinateur"...');
    };
    
    recognition.onresult = (event) => {
      const transcript = event.results[event.resultIndex][0].transcript;
      const confidence = event.results[event.resultIndex][0].confidence;
      const isFinal = event.results[event.resultIndex].isFinal;
      
      if (isFinal) {
        console.log('✅ Résultat final:', transcript);
        console.log('🎯 Confiance:', Math.round(confidence * 100) + '%');
        console.log('🔍 Recherche lancée avec:', transcript);
      } else {
        console.log('⏳ Résultat intermédiaire:', transcript);
      }
    };
    
    recognition.onerror = (event) => {
      console.log('❌ Erreur de reconnaissance:', event.error);
      
      switch (event.error) {
        case 'no-speech':
          console.log('💡 Aucune parole détectée. Parlez plus fort ou plus près du micro.');
          break;
        case 'audio-capture':
          console.log('💡 Impossible de capturer l\'audio. Vérifiez votre microphone.');
          break;
        case 'not-allowed':
          console.log('💡 Permission refusée. Autorisez l\'accès au microphone.');
          break;
        case 'network':
          console.log('💡 Erreur réseau. Vérifiez votre connexion internet.');
          break;
        default:
          console.log('💡 Erreur inconnue:', event.error);
      }
    };
    
    recognition.onend = () => {
      console.log('⏹️ Reconnaissance terminée');
    };
    
    // Démarrer le test (5 secondes)
    recognition.start();
    
    // Arrêt automatique après 10 secondes
    setTimeout(() => {
      try {
        recognition.stop();
        console.log('⏰ Test terminé après 10 secondes');
      } catch (err) {
        // Ignore si déjà arrêté
      }
    }, 10000);
    
    return true;
    
  } catch (err) {
    console.log('❌ Erreur lors de l\'initialisation:', err.message);
    return false;
  }
};

// 4. Vérifier l'intégration avec l'app
const checkAppIntegration = () => {
  console.log('\n🔗 Vérification de l\'intégration...');
  
  // Chercher le composant VoiceSearchButton
  const voiceButtons = document.querySelectorAll('[title*="voice"], [aria-label*="voice"]');
  console.log('🔍 Boutons vocaux trouvés:', voiceButtons.length);
  
  if (voiceButtons.length > 0) {
    console.log('✅ Composant VoiceSearchButton présent dans le DOM');
    voiceButtons.forEach((btn, index) => {
      console.log(`  - Bouton ${index + 1}:`, btn.getAttribute('title') || btn.getAttribute('aria-label'));
    });
  } else {
    console.log('❌ Aucun bouton de recherche vocale trouvé');
    console.log('💡 Vérifiez que le composant VoiceSearchButton est bien affiché');
  }
  
  // Vérifier les hooks React
  if (window.React) {
    console.log('✅ React détecté');
  }
  
  return voiceButtons.length > 0;
};

// 5. Exécution complète du diagnostic
const runFullDiagnostic = async () => {
  console.log('🚀 LANCEMENT DU DIAGNOSTIC COMPLET...\n');
  
  const apiSupport = checkAPISupport();
  if (!apiSupport) return;
  
  const micPermissions = await checkMicrophonePermissions();
  if (!micPermissions) return;
  
  const appIntegration = checkAppIntegration();
  
  console.log('\n📊 RÉSUMÉ DU DIAGNOSTIC:');
  console.log('========================');
  console.log('API Support:', apiSupport ? '✅' : '❌');
  console.log('Microphone:', micPermissions ? '✅' : '❌');
  console.log('Intégration App:', appIntegration ? '✅' : '❌');
  
  if (apiSupport && micPermissions) {
    console.log('\n🎯 TOUT EST PRÊT ! Lancement du test vocal...');
    setTimeout(() => {
      testSpeechRecognition();
    }, 1000);
  } else {
    console.log('\n❌ Des problèmes ont été détectés. Consultez le guide ci-dessus.');
  }
};

// Démarrer le diagnostic
runFullDiagnostic();

// Guide rapide dans la console
console.log('\n📚 GUIDE RAPIDE:');
console.log('===============');
console.log('1. Assurez-vous d\'être sur Chrome/Edge');
console.log('2. Autorisez l\'accès au microphone si demandé');
console.log('3. Cherchez l\'icône microphone 🎤 dans la barre de recherche');
console.log('4. Cliquez et parlez clairement');
console.log('5. La recherche se lance automatiquement');
console.log('\n🔄 Pour relancer ce test: runFullDiagnostic()');