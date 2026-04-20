#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');
const readline = require('readline');

const SKILL_NAME = 'claude-code-onboarding';
const FILES_TO_COPY = ['SKILL.md', 'assets', 'references'];

function parseArgs(argv) {
  const args = {
    local: false,
    force: false,
    uninstall: false,
    help: false,
  };
  for (const arg of argv.slice(2)) {
    if (arg === '--local') args.local = true;
    else if (arg === '--force' || arg === '-f') args.force = true;
    else if (arg === '--uninstall') args.uninstall = true;
    else if (arg === '--help' || arg === '-h') args.help = true;
    else {
      console.error(`Argumento desconocido: ${arg}`);
      console.error(`Usá --help para ver opciones disponibles.`);
      process.exit(1);
    }
  }
  return args;
}

function printHelp() {
  const msg = [
    '',
    'Uso:',
    '  npx github:ramonfajardo-tech/claude-code-onboarding [opciones]',
    '',
    'Opciones:',
    '  --local        Instala en .claude/skills/ del directorio actual',
    '                 (en vez de en el home del usuario).',
    '  --force, -f    Sobrescribe instalación existente sin preguntar.',
    '  --uninstall    Elimina la skill del destino.',
    '  --help, -h     Muestra esta ayuda.',
    '',
    'Ejemplos:',
    '  npx github:ramonfajardo-tech/claude-code-onboarding',
    '  npx github:ramonfajardo-tech/claude-code-onboarding --local',
    '  npx github:ramonfajardo-tech/claude-code-onboarding --uninstall',
    '',
  ].join('\n');
  console.log(msg);
}

function getTargetDir(local) {
  const base = local ? process.cwd() : os.homedir();
  return path.join(base, '.claude', 'skills', SKILL_NAME);
}

function confirm(question) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question(`${question} (y/N) `, (answer) => {
      rl.close();
      const a = answer.trim().toLowerCase();
      resolve(a === 'y' || a === 'yes' || a === 's' || a === 'si' || a === 'sí');
    });
  });
}

async function install(args) {
  const sourceDir = path.resolve(__dirname, '..');
  const targetDir = getTargetDir(args.local);

  console.log(`Instalando ${SKILL_NAME} en:`);
  console.log(`  ${targetDir}`);
  console.log('');

  if (fs.existsSync(targetDir)) {
    if (!args.force) {
      const ok = await confirm('Ya existe una instalación en ese destino. ¿Sobrescribir?');
      if (!ok) {
        console.log('Instalación cancelada.');
        process.exit(0);
      }
    }
    fs.rmSync(targetDir, { recursive: true, force: true });
  }

  fs.mkdirSync(targetDir, { recursive: true });

  for (const file of FILES_TO_COPY) {
    const src = path.join(sourceDir, file);
    const dst = path.join(targetDir, file);
    if (!fs.existsSync(src)) {
      console.error(`Error: no se encontró "${file}" en el package.`);
      console.error('El package puede estar corrupto o desactualizado.');
      process.exit(1);
    }
    fs.cpSync(src, dst, { recursive: true });
  }

  const lines = [
    '',
    'Skill instalada correctamente.',
    '',
    'Para dispararla, en una sesión de Claude Code decí algo como:',
    '  "estoy arrancando con Claude"',
    '  "primera vez con IA para programar"',
    '  "quiero sumar Claude a mi repo existente"',
    '',
    'Claude Code la reconocerá automáticamente.',
    '',
    'Para desinstalar:',
    '  npx github:ramonfajardo-tech/claude-code-onboarding --uninstall' +
      (args.local ? ' --local' : ''),
    '',
  ];
  console.log(lines.join('\n'));
}

async function uninstall(args) {
  const targetDir = getTargetDir(args.local);

  if (!fs.existsSync(targetDir)) {
    console.log(`No hay instalación en ${targetDir}.`);
    return;
  }

  if (!args.force) {
    const ok = await confirm(`¿Eliminar la skill de ${targetDir}?`);
    if (!ok) {
      console.log('Cancelado.');
      return;
    }
  }

  fs.rmSync(targetDir, { recursive: true, force: true });
  console.log(`Skill desinstalada de ${targetDir}.`);
}

(async () => {
  const args = parseArgs(process.argv);

  if (args.help) {
    printHelp();
    return;
  }

  try {
    if (args.uninstall) {
      await uninstall(args);
    } else {
      await install(args);
    }
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
})();
